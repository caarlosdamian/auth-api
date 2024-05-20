import { Router } from 'express';
import validateResourse from '../middleware/calidateResourse';
import { createSessionSchema } from '../schema/auth.schema';
import { createSessionHandler } from '../controller/auth.controller';

const router = Router();
router.post(
  '/api/auth/session',
  validateResourse(createSessionSchema),
  createSessionHandler
);

export default router;
