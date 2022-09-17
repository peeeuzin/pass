import { LoginUserController } from '@controllers/user/auth/LoginUser';
import { RegisterUserController } from '@controllers/user/auth/RegisterUser';
import { Router } from 'express';
const router = Router();

router.post('/register', RegisterUserController);
router.post('/login', LoginUserController);

export default router;
