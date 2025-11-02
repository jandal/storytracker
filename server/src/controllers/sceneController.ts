import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export async function getScenes(req: AuthRequest, res: Response) {
  try {
    const { campaignId } = req.params;

    const scenes = await prisma.scene.findMany({
      where: { campaignId },
      orderBy: { order: 'asc' },
      include: {
        variables: true,
      },
    });

    res.json(scenes);
  } catch (error) {
    console.error('Get scenes error:', error);
    res.status(500).json({ error: 'Failed to fetch scenes' });
  }
}

export async function getScene(req: AuthRequest, res: Response) {
  try {
    const { sceneId } = req.params;

    const scene = await prisma.scene.findUnique({
      where: { id: sceneId },
      include: {
        variables: true,
      },
    });

    if (!scene) {
      return res.status(404).json({ error: 'Scene not found' });
    }

    res.json(scene);
  } catch (error) {
    console.error('Get scene error:', error);
    res.status(500).json({ error: 'Failed to fetch scene' });
  }
}

export async function createScene(req: AuthRequest, res: Response) {
  try {
    const { campaignId } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Scene name required' });
    }

    // Get the max order value
    const maxScene = await prisma.scene.findFirst({
      where: { campaignId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = (maxScene?.order || 0) + 1;

    const scene = await prisma.scene.create({
      data: {
        name,
        description: description || null,
        order,
        campaignId,
        nodes: [],
        edges: [],
      },
      include: {
        variables: true,
      },
    });

    res.json(scene);
  } catch (error) {
    console.error('Create scene error:', error);
    res.status(500).json({ error: 'Failed to create scene' });
  }
}

export async function updateScene(req: AuthRequest, res: Response) {
  try {
    const { sceneId } = req.params;
    const { name, description } = req.body;

    const scene = await prisma.scene.update({
      where: { id: sceneId },
      data: {
        name: name || undefined,
        description: description || undefined,
      },
    });

    res.json(scene);
  } catch (error) {
    console.error('Update scene error:', error);
    res.status(500).json({ error: 'Failed to update scene' });
  }
}

export async function saveSceneGraph(req: AuthRequest, res: Response) {
  try {
    const { sceneId } = req.params;
    const { nodes, edges, viewport } = req.body;

    const scene = await prisma.scene.update({
      where: { id: sceneId },
      data: {
        nodes: nodes || [],
        edges: edges || [],
        viewport: viewport || null,
      },
    });

    res.json(scene);
  } catch (error) {
    console.error('Save graph error:', error);
    res.status(500).json({ error: 'Failed to save graph' });
  }
}

export async function deleteScene(req: AuthRequest, res: Response) {
  try {
    const { sceneId } = req.params;

    await prisma.scene.delete({
      where: { id: sceneId },
    });

    res.json({ message: 'Scene deleted' });
  } catch (error) {
    console.error('Delete scene error:', error);
    res.status(500).json({ error: 'Failed to delete scene' });
  }
}

export async function duplicateScene(req: AuthRequest, res: Response) {
  try {
    const { sceneId } = req.params;
    const { name } = req.body;

    const original = await prisma.scene.findUnique({
      where: { id: sceneId },
      include: { variables: true },
    });

    if (!original) {
      return res.status(404).json({ error: 'Scene not found' });
    }

    // Get max order
    const maxScene = await prisma.scene.findFirst({
      where: { campaignId: original.campaignId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = (maxScene?.order || 0) + 1;

    const duplicate = await prisma.scene.create({
      data: {
        name: name || `${original.name} (Copy)`,
        description: original.description,
        order: newOrder,
        campaignId: original.campaignId,
        nodes: original.nodes,
        edges: original.edges,
        viewport: original.viewport,
      },
      include: { variables: true },
    });

    res.json(duplicate);
  } catch (error) {
    console.error('Duplicate scene error:', error);
    res.status(500).json({ error: 'Failed to duplicate scene' });
  }
}

export async function reorderScenes(req: AuthRequest, res: Response) {
  try {
    const { campaignId } = req.params;
    const { sceneOrders } = req.body; // Array of { sceneId, order }

    if (!Array.isArray(sceneOrders)) {
      return res.status(400).json({ error: 'Scene orders array required' });
    }

    // Update all scenes
    await Promise.all(
      sceneOrders.map((so: any) =>
        prisma.scene.update({
          where: { id: so.sceneId },
          data: { order: so.order },
        })
      )
    );

    const scenes = await prisma.scene.findMany({
      where: { campaignId },
      orderBy: { order: 'asc' },
    });

    res.json(scenes);
  } catch (error) {
    console.error('Reorder scenes error:', error);
    res.status(500).json({ error: 'Failed to reorder scenes' });
  }
}
