import { Request, Response } from 'express';
import { HTTPError } from '@errors/HTTPError';
import { UpdateAppSecretService } from '@services/oauth/UpdateAppSecret';

async function UpdateAppSecretController(request: Request, response: Response) {
    const { appId } = request.params;
    const { userId } = request;

    try {
        if (!appId) throw new HTTPError('appId.required', 400);

        const service = await UpdateAppSecretService(appId, userId);

        response.status(200).json(service);
    } catch (error: any) {
        console.log(error);
        return response
            .status(error.status ?? 500)
            .json({ error: error.message });
    }
}

export { UpdateAppSecretController };
