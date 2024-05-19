import { Router } from 'express';
import validateResourse from '../middleware/calidateResourse';
import { createUserschema, verifyUserSchema } from '../schema/user.schema';
import {
  createUserHandler,
  verifyUserHandler,
} from '../controller/user.controller';

const router = Router();

router.post('/', validateResourse(createUserschema), createUserHandler);
router.get(
  '/verify/:id/:verificationCode',
  validateResourse(verifyUserSchema),
  verifyUserHandler
);

export default router;
