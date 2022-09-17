import { CreateAppController } from '@controllers/oauth/CreateApp';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { Router } from 'express';
const router = Router();

router.post('/create', ensureAuthenticated, CreateAppController);

export default router;
