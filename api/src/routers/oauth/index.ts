import { CreateAppController } from '@controllers/oauth/CreateApp';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { Router } from 'express';
import AuthRouter from './auth';

const router = Router();

router.post('/create', ensureAuthenticated, CreateAppController);
router.use('/auth', AuthRouter);

router.get('/test/callback', (request, response) => {
    const { code } = request.query;

    return response.json({ code });
});

export default router;
