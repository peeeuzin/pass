import { Request, Response } from 'express';
import { HTTPError } from '@errors/HTTPError';
import { UpdateAppService } from '@services/oauth/UpdateApp';

async function UpdateAppController(request: Request, response: Response) {
    const { appId } = request.params;
    const { name, description, redirectUrl, homeUrl } = request.body;
    const { userId, user } = request;

    try {
        if (!appId) throw new HTTPError('appId.required', 400);

        const service = await UpdateAppService(appId, userId, {
            name,
            description,
            redirectUrl,
            homeUrl,
            isAuthByOAuth: user.isAuthByOAuth,
        });

        response.status(200).json(service);
    } catch (error: any) {
        console.log(error);
        return response
            .status(error.status ?? 500)
            .json({ error: error.message });
    }
}

export { UpdateAppController };
