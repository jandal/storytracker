import { Router } from 'express';
import {
  generateDialogue,
  generateNPC,
  suggestBranches,
  generateQuest,
  analyzeCampaign,
} from '../controllers/aiController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/generate-dialogue', generateDialogue);
router.post('/generate-npc', generateNPC);
router.post('/suggest-branches', suggestBranches);
router.post('/generate-quest', generateQuest);
router.post('/analyze-campaign', analyzeCampaign);

export default router;
