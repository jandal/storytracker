import { Router } from 'express';
import {
  getSettings,
  updateApiKeySettings,
  testApiKey,
  removeApiKey
} from '../controllers/settingsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All settings routes require authentication
router.use(authMiddleware);

router.get('/', getSettings);
router.post('/anthropic', updateApiKeySettings);
router.post('/anthropic/test', testApiKey);
router.delete('/anthropic', removeApiKey);

export default router;
