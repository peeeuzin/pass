import { Request, Response } from 'express';
import { HTTPError } from '@errors/HTTPError';
import { AuthorizeService } from '@services/oauth/auth/Authorize';

async function AuthorizeController(request: Request, response: Response) {
    const { client_id: clientId } = request.query;
    const { userId } = request;

    try {
        if (!clientId) throw new HTTPError('clientId.required', 400);

        const service = await AuthorizeService({
            clientId: clientId as string,
            userId,
        });

        response.redirect(`${service.redirectUrl}?code=${service.code}`);
    } catch (error: any) {
        console.log(error);
        return response
            .status(error.status ?? 500)
            .json({ error: error.message });
    }
}

export { AuthorizeController };
