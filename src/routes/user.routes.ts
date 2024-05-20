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
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from '../controller/user.controller';
import requireUser from '../middleware/requireUser';

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
router.get('/me',requireUser,getCurrentUserHandler)

export default router;
