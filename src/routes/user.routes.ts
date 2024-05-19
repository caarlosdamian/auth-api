import { Router } from 'express';
import validateResourse from '../middleware/calidateResourse';
import { createUserschema } from '../schema/user.schema';
import { createUserHandler } from '../controller/user.controller';

const router = Router();

router.post('/', validateResourse(createUserschema), createUserHandler);

export default router;
