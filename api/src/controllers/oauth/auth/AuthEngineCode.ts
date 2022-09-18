import { Request, Response } from 'express';
import { HTTPError } from '@errors/HTTPError';
import { AuthEngineCodeService } from '@services/oauth/auth/AuthEngineCode';

async function AuthEngineCodeController(request: Request, response: Response) {
    const { user, userId } = request;
    const { code } = request.body;

    try {
        if (!code) throw new HTTPError('code.required', 400);
        const service = await AuthEngineCodeService({
            userId,
            isAuthByOAuth: user.isAuthByOAuth,
            code,
        });

        response.status(200).json(service);
    } catch (error: any) {
        console.log(error);
        return response
            .status(error.status ?? 500)
            .json({ error: error.message });
    }
}

export { AuthEngineCodeController };
