import { Router } from 'express';
import {
  getGlobalVariables,
  createGlobalVariable,
  updateGlobalVariable,
  deleteGlobalVariable,
  getLocalVariables,
  createLocalVariable,
  updateLocalVariable,
  deleteLocalVariable,
} from '../controllers/variableController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All variable routes require authentication
router.use(authMiddleware);

// Global variables (campaign-wide)
router.get('/global/campaigns/:campaignId', getGlobalVariables);
router.post('/global/campaigns/:campaignId', createGlobalVariable);
router.patch('/global/:variableId', updateGlobalVariable);
router.delete('/global/:variableId', deleteGlobalVariable);

// Local variables (scene-specific)
router.get('/local/scenes/:sceneId', getLocalVariables);
router.post('/local/scenes/:sceneId', createLocalVariable);
router.patch('/local/:variableId', updateLocalVariable);
router.delete('/local/:variableId', deleteLocalVariable);

export default router;
