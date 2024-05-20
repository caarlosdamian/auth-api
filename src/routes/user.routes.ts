import { Router } from 'express';
import validateResourse from '../middleware/calidateResourse';
import {
  createUserschema,
  forgotPasswordSchema,
  verifyUserSchema,
} from '../schema/user.schema';
import {
  createUserHandler,
  forgotPasswordHandler,
  verifyUserHandler,
} from '../controller/user.controller';

const router = Router();

router.post('/', validateResourse(createUserschema), createUserHandler);
router.get(
  '/verify/:id/:verificationCode',
  validateResourse(verifyUserSchema),
  verifyUserHandler
);
router.post(
  '/forgotpassword',
  validateResourse(forgotPasswordSchema),
  forgotPasswordHandler
);

export default router;
