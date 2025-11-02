import { Router } from 'express';
import {
  getNPCs,
  getNPC,
  createNPC,
  updateNPC,
  deleteNPC,
} from '../controllers/npcController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/campaigns/:campaignId', getNPCs);
router.post('/campaigns/:campaignId', createNPC);
router.get('/:npcId', getNPC);
router.patch('/:npcId', updateNPC);
router.delete('/:npcId', deleteNPC);

export default router;
