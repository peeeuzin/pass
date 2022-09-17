import { Request, Response } from 'express';
import { HTTPError } from '@errors/HTTPError';
import { LoginUserService } from '@services/user/auth/LoginUser';

async function RegisterUserController(request: Request, response: Response) {
    const { username, email, password } = request.body;

    try {
        if (!username && !email)
            throw new HTTPError('email.or.username.required', 400);
        if (!password) throw new HTTPError('password.required', 400);

        const service = await LoginUserService({
            username,
            email,
            password,
        });

        response.status(200).json(service);
    } catch (error: any) {
        console.log(error);
        return response
            .status(error.status ?? 500)
            .json({ error: error.message });
    }
}

export { RegisterUserController };
