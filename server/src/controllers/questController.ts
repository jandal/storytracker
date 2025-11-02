import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function getQuests(req: AuthRequest, res: Response) {
  try {
    const { campaignId } = req.params;

    const quests = await prisma.quest.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(quests);
  } catch (error) {
    console.error('Get quests error:', error);
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
}

export async function getQuest(req: AuthRequest, res: Response) {
  try {
    const { questId } = req.params;

    const quest = await prisma.quest.findUnique({
      where: { id: questId },
    });

    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    res.json(quest);
  } catch (error) {
    console.error('Get quest error:', error);
    res.status(500).json({ error: 'Failed to fetch quest' });
  }
}

export async function createQuest(req: AuthRequest, res: Response) {
  try {
    const { campaignId } = req.params;
    const { name, description, objectives } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description required' });
    }

    // Create objectives array with IDs
    const questObjectives = (objectives || []).map((obj: any) => ({
      id: uuidv4(),
      text: typeof obj === 'string' ? obj : obj.text,
      completed: false,
    }));

    const quest = await prisma.quest.create({
      data: {
        name,
        description,
        objectives: questObjectives,
        status: 'NOT_STARTED',
        campaignId,
      },
    });

    res.json(quest);
  } catch (error) {
    console.error('Create quest error:', error);
    res.status(500).json({ error: 'Failed to create quest' });
  }
}

export async function updateQuest(req: AuthRequest, res: Response) {
  try {
    const { questId } = req.params;
    const { name, description, objectives, status } = req.body;

    const quest = await prisma.quest.update({
      where: { id: questId },
      data: {
        name: name || undefined,
        description: description || undefined,
        objectives: objectives || undefined,
        status: status || undefined,
      },
    });

    res.json(quest);
  } catch (error) {
    console.error('Update quest error:', error);
    res.status(500).json({ error: 'Failed to update quest' });
  }
}

export async function updateQuestStatus(req: AuthRequest, res: Response) {
  try {
    const { questId } = req.params;
    const { status } = req.body;

    const validStatuses = ['NOT_STARTED', 'ACTIVE', 'COMPLETED', 'FAILED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid quest status' });
    }

    const quest = await prisma.quest.update({
      where: { id: questId },
      data: { status },
    });

    res.json(quest);
  } catch (error) {
    console.error('Update quest status error:', error);
    res.status(500).json({ error: 'Failed to update quest status' });
  }
}

export async function updateQuestObjective(req: AuthRequest, res: Response) {
  try {
    const { questId } = req.params;
    const { objectiveId, completed } = req.body;

    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    const objectives = (quest.objectives as any[]).map((obj: any) =>
      obj.id === objectiveId ? { ...obj, completed } : obj
    );

    const updated = await prisma.quest.update({
      where: { id: questId },
      data: { objectives },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update objective error:', error);
    res.status(500).json({ error: 'Failed to update objective' });
  }
}

export async function deleteQuest(req: AuthRequest, res: Response) {
  try {
    const { questId } = req.params;

    await prisma.quest.delete({
      where: { id: questId },
    });

    res.json({ message: 'Quest deleted' });
  } catch (error) {
    console.error('Delete quest error:', error);
    res.status(500).json({ error: 'Failed to delete quest' });
  }
}
