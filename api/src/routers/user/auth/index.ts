import { RegisterUserController } from '@controllers/user/auth/RegisterUser';
import { Router } from 'express';
const router = Router();

router.post('/register', RegisterUserController);
router.post('/login', RegisterUserController);

export default router;
