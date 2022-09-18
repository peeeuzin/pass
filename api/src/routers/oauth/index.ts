import { CreateAppController } from '@controllers/oauth/CreateApp';
import { DeleteAppController } from '@controllers/oauth/DeleteApp';
import { GetAppController } from '@controllers/oauth/GetApp';
import { GetAppSecretController } from '@controllers/oauth/GetAppSecret';
import { UpdateAppController } from '@controllers/oauth/UpdateApp';
import { UpdateAppSecretController } from '@controllers/oauth/UpdateAppSecret';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { Router } from 'express';
import AuthRouter from './auth';

const router = Router();

router.post('/create', ensureAuthenticated, CreateAppController);

router.get('/get/:appId', GetAppController);
router.get('/get/secret/:appId', ensureAuthenticated, GetAppSecretController);

router.put('/update/:appId', ensureAuthenticated, UpdateAppController);
router.put(
    '/update/secret/:appId',
    ensureAuthenticated,
    UpdateAppSecretController
);

router.delete('/delete/:appId', ensureAuthenticated, DeleteAppController);

router.use('/auth', AuthRouter);

router.get('/test/callback', (request, response) => {
    const { code } = request.query;

    return response.json({ code });
});

export default router;
