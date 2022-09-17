import { Request, Response } from 'express';
import { HTTPError } from '@errors/HTTPError';
import { RegisterUserService } from '@services/user/auth/RegisterUser';

async function LoginUserController(request: Request, response: Response) {
    const { username, password, email, name } = request.body;

    try {
        if (!username) throw new HTTPError('username.required', 400);
        if (!password) throw new HTTPError('password.required', 400);
        if (!email) throw new HTTPError('email.required', 400);

        const service = await RegisterUserService({
            email,
            username,
            password,
            name,
        });

        response.status(200).json(service);
    } catch (error: any) {
        console.log(error);
        return response
            .status(error.status ?? 500)
            .json({ error: error.message });
    }
}

export { LoginUserController };
