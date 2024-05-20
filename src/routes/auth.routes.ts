import { Router } from 'express';
import validateResourse from '../middleware/calidateResourse';
import { createSessionSchema } from '../schema/auth.schema';
import { createSessionHandler, refreshAccessTokenHandler } from '../controller/auth.controller';

const router = Router();
router.post(
  '/api/auth/session',
  validateResourse(createSessionSchema),
  createSessionHandler
);
router.post(
  '/api/auth/session/refresh',
  validateResourse(createSessionSchema),
  refreshAccessTokenHandler
);

export default router;
