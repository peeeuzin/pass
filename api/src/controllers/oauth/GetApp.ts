import { Request, Response } from 'express';
import { HTTPError } from '@errors/HTTPError';
import { GetAppService } from '@services/oauth/GetApp';

async function GetAppController(request: Request, response: Response) {
    const { appId } = request.params;

    try {
        if (!appId) throw new HTTPError('appId.required', 400);

        const service = await GetAppService(appId);

        response.status(200).json(service);
    } catch (error: any) {
        console.log(error);
        return response
            .status(error.status ?? 500)
            .json({ error: error.message });
    }
}

export { GetAppController };
