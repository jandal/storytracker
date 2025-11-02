import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createAnthropicServiceFromEncrypted, ModelType } from '../utils/anthropicService';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

/**
 * Generate dialogue for an NPC
 * POST /api/ai/generate-dialogue
 */
export async function generateDialogue(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const { speaker, npcPersonality, sceneSoFar, campaignContext, campaignId } = req.body;

    // Get user's API key and model
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.anthropicApiKey || !user.anthropicModel) {
      return res.status(400).json({ error: 'API key not configured' });
    }

    // Create Anthropic service from encrypted key
    const service = await createAnthropicServiceFromEncrypted(user.anthropicApiKey, user.anthropicModel as ModelType);

    // Generate dialogue
    const dialogue = await service.generateDialogue({
      speaker: speaker || 'NPC',
      npcPersonality,
      sceneSoFar,
      campaignContext,
    });

    res.json({ dialogue });
  } catch (error) {
    console.error('Error generating dialogue:', error);
    res.status(500).json({ error: 'Failed to generate dialogue' });
  }
}

/**
 * Generate NPC profile
 * POST /api/ai/generate-npc
 */
export async function generateNPC(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const { name, role, campaignSetting } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'NPC name is required' });
    }

    // Get user's API key and model
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.anthropicApiKey || !user.anthropicModel) {
      return res.status(400).json({ error: 'API key not configured' });
    }

    // Create Anthropic service
    const service = await createAnthropicServiceFromEncrypted(user.anthropicApiKey, user.anthropicModel as ModelType);

    // Generate NPC profile
    const profile = await service.generateNPCProfile({
      name,
      role,
      campaignSetting,
    });

    res.json(profile);
  } catch (error) {
    console.error('Error generating NPC:', error);
    res.status(500).json({ error: 'Failed to generate NPC profile' });
  }
}

/**
 * Suggest story branches
 * POST /api/ai/suggest-branches
 */
export async function suggestBranches(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const { currentScene, playerActions, campaignGoal, numberOfSuggestions } = req.body;

    if (!currentScene || currentScene.trim().length === 0) {
      return res.status(400).json({ error: 'Current scene description is required' });
    }

    // Get user's API key and model
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.anthropicApiKey || !user.anthropicModel) {
      return res.status(400).json({ error: 'API key not configured' });
    }

    // Create Anthropic service
    const service = await createAnthropicServiceFromEncrypted(user.anthropicApiKey, user.anthropicModel as ModelType);

    // Generate suggestions
    const branches = await service.suggestBranches({
      currentScene,
      playerActions,
      campaignGoal,
      numberOfSuggestions: numberOfSuggestions || 3,
    });

    res.json({ branches });
  } catch (error) {
    console.error('Error suggesting branches:', error);
    res.status(500).json({ error: 'Failed to suggest branches' });
  }
}

/**
 * Generate quest hook
 * POST /api/ai/generate-quest
 */
export async function generateQuest(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const { questTheme, campaignContext, rewardType } = req.body;

    // Get user's API key and model
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.anthropicApiKey || !user.anthropicModel) {
      return res.status(400).json({ error: 'API key not configured' });
    }

    // Create Anthropic service
    const service = await createAnthropicServiceFromEncrypted(user.anthropicApiKey, user.anthropicModel as ModelType);

    // Generate quest
    const quest = await service.generateQuestHook({
      questTheme,
      campaignContext,
      rewardType,
    });

    res.json(quest);
  } catch (error) {
    console.error('Error generating quest:', error);
    res.status(500).json({ error: 'Failed to generate quest' });
  }
}

/**
 * Analyze campaign narrative
 * POST /api/ai/analyze-campaign
 */
export async function analyzeCampaign(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    // Verify user owns the campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        scenes: true,
        npcs: true,
        quests: true,
      },
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (campaign.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get user's API key and model
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.anthropicApiKey || !user.anthropicModel) {
      return res.status(400).json({ error: 'API key not configured' });
    }

    // Create Anthropic service
    const service = await createAnthropicServiceFromEncrypted(user.anthropicApiKey, user.anthropicModel as ModelType);

    // Analyze campaign
    const analysis = await service.analyzeCampaign({
      campaignName: campaign.name,
      campaignDescription: campaign.description || undefined,
      scenesCount: campaign.scenes.length,
      npcsCount: campaign.npcs.length,
      questsCount: campaign.quests.length,
    });

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing campaign:', error);
    res.status(500).json({ error: 'Failed to analyze campaign' });
  }
}
