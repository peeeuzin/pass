import { AccessTokenController } from '@controllers/oauth/auth/AccessToken';
import { AuthEngineCodeController } from '@controllers/oauth/auth/AuthEngineCode';
import { AuthorizeController } from '@controllers/oauth/auth/Authorize';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { Router } from 'express';
const router = Router();

router.post('/authorize', ensureAuthenticated, AuthorizeController);
router.post('/accessToken', AccessTokenController);

// expose engine to the world
router.post('/engine/code', ensureAuthenticated, AuthEngineCodeController);

export default router;
