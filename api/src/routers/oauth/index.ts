import { CreateAppController } from '@controllers/oauth/CreateApp';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { Router } from 'express';
import AuthRouter from './auth';

const router = Router();

router.post('/create', ensureAuthenticated, CreateAppController);
router.use('/auth', AuthRouter);

export default router;
