import { Request, Response } from 'express';
import { HTTPError } from '@errors/HTTPError';
import { AccessTokenService } from '@services/oauth/auth/AccessToken';

async function AccessTokenController(request: Request, response: Response) {
    const { clientId, clientSecret, code } = request.body;

    try {
        if (!clientId) throw new HTTPError('clientId.required', 400);
        if (!code) throw new HTTPError('code.required', 400);
        if (!clientSecret) throw new HTTPError('clientSecret.required', 400);

        const service = await AccessTokenService({
            clientId,
            code,
            clientSecret,
        });

        response.status(200).json(service);
    } catch (error: any) {
        console.log(error);
        return response
            .status(error.status ?? 500)
            .json({ error: error.message });
    }
}

export { AccessTokenController };
