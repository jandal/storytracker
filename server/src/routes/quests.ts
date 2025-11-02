import { Router } from 'express';
import {
  getQuests,
  getQuest,
  createQuest,
  updateQuest,
  updateQuestStatus,
  updateQuestObjective,
  deleteQuest,
} from '../controllers/questController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/campaigns/:campaignId', getQuests);
router.post('/campaigns/:campaignId', createQuest);
router.get('/:questId', getQuest);
router.patch('/:questId', updateQuest);
router.patch('/:questId/status', updateQuestStatus);
router.patch('/:questId/objectives/:objectiveId', updateQuestObjective);
router.delete('/:questId', deleteQuest);

export default router;
