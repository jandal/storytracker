import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export async function getGlobalVariables(req: AuthRequest, res: Response) {
  try {
    const { campaignId } = req.params;

    const variables = await prisma.globalVariable.findMany({
      where: { campaignId },
    });

    res.json(variables);
  } catch (error) {
    console.error('Get variables error:', error);
    res.status(500).json({ error: 'Failed to fetch variables' });
  }
}

export async function createGlobalVariable(req: AuthRequest, res: Response) {
  try {
    const { campaignId } = req.params;
    const { name, type, value } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type required' });
    }

    // Check if variable already exists
    const existing = await prisma.globalVariable.findFirst({
      where: { campaignId, name },
    });

    if (existing) {
      return res.status(400).json({ error: 'Variable already exists' });
    }

    const variable = await prisma.globalVariable.create({
      data: {
        name,
        type,
        value: value || null,
        campaignId,
      },
    });

    res.json(variable);
  } catch (error) {
    console.error('Create variable error:', error);
    res.status(500).json({ error: 'Failed to create variable' });
  }
}

export async function updateGlobalVariable(req: AuthRequest, res: Response) {
  try {
    const { variableId } = req.params;
    const { value } = req.body;

    const variable = await prisma.globalVariable.update({
      where: { id: variableId },
      data: { value },
    });

    res.json(variable);
  } catch (error) {
    console.error('Update variable error:', error);
    res.status(500).json({ error: 'Failed to update variable' });
  }
}

export async function deleteGlobalVariable(req: AuthRequest, res: Response) {
  try {
    const { variableId } = req.params;

    await prisma.globalVariable.delete({
      where: { id: variableId },
    });

    res.json({ message: 'Variable deleted' });
  } catch (error) {
    console.error('Delete variable error:', error);
    res.status(500).json({ error: 'Failed to delete variable' });
  }
}

export async function getLocalVariables(req: AuthRequest, res: Response) {
  try {
    const { sceneId } = req.params;

    const variables = await prisma.localVariable.findMany({
      where: { sceneId },
    });

    res.json(variables);
  } catch (error) {
    console.error('Get local variables error:', error);
    res.status(500).json({ error: 'Failed to fetch variables' });
  }
}

export async function createLocalVariable(req: AuthRequest, res: Response) {
  try {
    const { sceneId } = req.params;
    const { name, type, value } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type required' });
    }

    const existing = await prisma.localVariable.findFirst({
      where: { sceneId, name },
    });

    if (existing) {
      return res.status(400).json({ error: 'Variable already exists' });
    }

    const variable = await prisma.localVariable.create({
      data: {
        name,
        type,
        value: value || null,
        sceneId,
      },
    });

    res.json(variable);
  } catch (error) {
    console.error('Create local variable error:', error);
    res.status(500).json({ error: 'Failed to create variable' });
  }
}

export async function updateLocalVariable(req: AuthRequest, res: Response) {
  try {
    const { variableId } = req.params;
    const { value } = req.body;

    const variable = await prisma.localVariable.update({
      where: { id: variableId },
      data: { value },
    });

    res.json(variable);
  } catch (error) {
    console.error('Update local variable error:', error);
    res.status(500).json({ error: 'Failed to update variable' });
  }
}

export async function deleteLocalVariable(req: AuthRequest, res: Response) {
  try {
    const { variableId } = req.params;

    await prisma.localVariable.delete({
      where: { id: variableId },
    });

    res.json({ message: 'Variable deleted' });
  } catch (error) {
    console.error('Delete local variable error:', error);
    res.status(500).json({ error: 'Failed to delete variable' });
  }
}
