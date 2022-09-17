import { GetProfileController } from '@controllers/user/GetProfile';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { Router } from 'express';
import Auth from './auth';
const router = Router();

router.use('/auth', Auth);
router.get('/profile', ensureAuthenticated, GetProfileController);

export default router;
