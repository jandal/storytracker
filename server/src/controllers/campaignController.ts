import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export async function getCampaigns(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const campaigns = await prisma.campaign.findMany({
      where: { userId: req.userId },
      include: {
        scenes: {
          select: { id: true, name: true, order: true },
        },
        _count: {
          select: { npcs: true, quests: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(campaigns);
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
}

export async function getCampaign(req: AuthRequest, res: Response) {
  try {
    const { campaignId } = req.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        scenes: { orderBy: { order: 'asc' } },
        npcs: true,
        quests: true,
        variables: true,
      },
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
}

export async function createCampaign(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Campaign name required' });
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description: description || null,
        userId: req.userId,
      },
      include: {
        scenes: true,
      },
    });

    res.json(campaign);
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
}

export async function updateCampaign(req: AuthRequest, res: Response) {
  try {
    const { campaignId } = req.params;
    const { name, description, coverImage } = req.body;

    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        name: name || undefined,
        description: description || undefined,
        coverImage: coverImage || undefined,
      },
    });

    res.json(campaign);
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
}

export async function deleteCampaign(req: AuthRequest, res: Response) {
  try {
    const { campaignId } = req.params;

    await prisma.campaign.delete({
      where: { id: campaignId },
    });

    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
}
