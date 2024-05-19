import express from 'express';
import userRouter from './user.routes';
import authRouter from './auth.routes';

const router = express.Router();

router.get('/healthcheck', (_, res) => {
  res.sendStatus(200);
});
router.use('/api/users', userRouter);
router.use(authRouter);

export default router;
