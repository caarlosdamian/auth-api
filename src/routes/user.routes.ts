import { Router } from 'express';
import validateResourse from '../middleware/calidateResourse';
import {
  createUserschema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from '../schema/user.schema';
import {
  createUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
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
router.post(
  '/resetpassword/:id/:passwordResetCode',
  validateResourse(resetPasswordSchema),
  resetPasswordHandler
);

export default router;
