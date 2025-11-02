import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { encryptApiKey, decryptApiKey } from '../utils/encryption';
import { Anthropic } from '@anthropic-ai/sdk';

const prisma = new PrismaClient();

export async function getSettings(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      anthropicModel: user.anthropicModel,
      hasApiKey: !!user.anthropicApiKey,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
}

export async function updateApiKeySettings(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { apiKey, model } = req.body;

    if (!apiKey || !model) {
      return res.status(400).json({ error: 'API key and model required' });
    }

    // Validate API key format (should start with sk-)
    if (!apiKey.startsWith('sk-')) {
      return res.status(400).json({ error: 'Invalid API key format' });
    }

    // Encrypt the API key
    const encryptedKey = encryptApiKey(apiKey);

    // Update user
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: {
        anthropicApiKey: encryptedKey,
        anthropicModel: model,
      },
    });

    res.json({
      message: 'Settings updated successfully',
      anthropicModel: updated.anthropicModel,
      hasApiKey: !!updated.anthropicApiKey,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
}

export async function testApiKey(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { apiKey, model } = req.body;

    if (!apiKey || !model) {
      return res.status(400).json({ error: 'API key and model required' });
    }

    // Test the API key with a simple request
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model,
      max_tokens: 10,
      messages: [
        {
          role: 'user',
          content: 'test',
        },
      ],
    });

    res.json({ valid: true, message: 'API key is valid' });
  } catch (error: any) {
    console.error('Test API key error:', error);

    if (error.status === 401) {
      return res.status(400).json({ error: 'Invalid API key' });
    }

    if (error.status === 404) {
      return res.status(400).json({ error: 'Invalid model name' });
    }

    res.status(400).json({ error: 'Failed to validate API key' });
  }
}

export async function removeApiKey(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await prisma.user.update({
      where: { id: req.userId },
      data: {
        anthropicApiKey: null,
        anthropicModel: null,
      },
    });

    res.json({ message: 'API key removed successfully' });
  } catch (error) {
    console.error('Remove API key error:', error);
    res.status(500).json({ error: 'Failed to remove API key' });
  }
}
