import { AccessTokenController } from '@controllers/oauth/auth/AccessToken';
import { AuthorizeController } from '@controllers/oauth/auth/Authorize';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { Router } from 'express';
const router = Router();

router.post('/authorize', ensureAuthenticated, AuthorizeController);
router.post('/accessToken', AccessTokenController);

export default router;
