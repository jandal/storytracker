import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export async function getNPCs(req: AuthRequest, res: Response) {
  try {
    const { campaignId } = req.params;

    const npcs = await prisma.npc.findMany({
      where: { campaignId },
      orderBy: { name: 'asc' },
    });

    res.json(npcs);
  } catch (error) {
    console.error('Get NPCs error:', error);
    res.status(500).json({ error: 'Failed to fetch NPCs' });
  }
}

export async function getNPC(req: AuthRequest, res: Response) {
  try {
    const { npcId } = req.params;

    const npc = await prisma.npc.findUnique({
      where: { id: npcId },
    });

    if (!npc) {
      return res.status(404).json({ error: 'NPC not found' });
    }

    res.json(npc);
  } catch (error) {
    console.error('Get NPC error:', error);
    res.status(500).json({ error: 'Failed to fetch NPC' });
  }
}

export async function createNPC(req: AuthRequest, res: Response) {
  try {
    const { campaignId } = req.params;
    const { name, race, class: npcClass, level, personality, appearance, backstory, portrait } =
      req.body;

    if (!name) {
      return res.status(400).json({ error: 'NPC name required' });
    }

    const npc = await prisma.npc.create({
      data: {
        name,
        race: race || null,
        class: npcClass || null,
        level: level || null,
        personality: personality || null,
        appearance: appearance || null,
        backstory: backstory || null,
        portrait: portrait || null,
        campaignId,
      },
    });

    res.json(npc);
  } catch (error) {
    console.error('Create NPC error:', error);
    res.status(500).json({ error: 'Failed to create NPC' });
  }
}

export async function updateNPC(req: AuthRequest, res: Response) {
  try {
    const { npcId } = req.params;
    const {
      name,
      race,
      class: npcClass,
      level,
      stats,
      armorClass,
      hitPoints,
      personality,
      appearance,
      backstory,
      portrait,
      faction,
      location,
    } = req.body;

    const npc = await prisma.npc.update({
      where: { id: npcId },
      data: {
        name: name || undefined,
        race: race || undefined,
        class: npcClass || undefined,
        level: level || undefined,
        stats: stats || undefined,
        armorClass: armorClass || undefined,
        hitPoints: hitPoints || undefined,
        personality: personality || undefined,
        appearance: appearance || undefined,
        backstory: backstory || undefined,
        portrait: portrait || undefined,
        faction: faction || undefined,
        location: location || undefined,
      },
    });

    res.json(npc);
  } catch (error) {
    console.error('Update NPC error:', error);
    res.status(500).json({ error: 'Failed to update NPC' });
  }
}

export async function deleteNPC(req: AuthRequest, res: Response) {
  try {
    const { npcId } = req.params;

    await prisma.npc.delete({
      where: { id: npcId },
    });

    res.json({ message: 'NPC deleted' });
  } catch (error) {
    console.error('Delete NPC error:', error);
    res.status(500).json({ error: 'Failed to delete NPC' });
  }
}
