import { Router } from 'express';
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from '../controllers/campaignController';
import {
  getScenes,
  getScene,
  createScene,
  updateScene,
  saveSceneGraph,
  deleteScene,
  duplicateScene,
  reorderScenes,
} from '../controllers/sceneController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Campaign routes
router.get('/', getCampaigns);
router.post('/', createCampaign);
router.get('/:campaignId', getCampaign);
router.patch('/:campaignId', updateCampaign);
router.delete('/:campaignId', deleteCampaign);

// Scene routes
router.get('/:campaignId/scenes', getScenes);
router.post('/:campaignId/scenes', createScene);
router.get('/:campaignId/scenes/:sceneId', getScene);
router.patch('/:campaignId/scenes/:sceneId', updateScene);
router.post('/:campaignId/scenes/:sceneId/graph', saveSceneGraph);
router.delete('/:campaignId/scenes/:sceneId', deleteScene);
router.post('/:campaignId/scenes/:sceneId/duplicate', duplicateScene);
router.patch('/:campaignId/scenes/reorder', reorderScenes);

export default router;
