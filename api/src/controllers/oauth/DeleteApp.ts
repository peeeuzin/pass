import { Request, Response } from 'express';
import { HTTPError } from '@errors/HTTPError';
import { DeleteAppService } from '@services/oauth/DeleteApp';

async function DeleteAppController(request: Request, response: Response) {
    const { appId } = request.params;
    const { userId } = request;

    try {
        if (!appId) throw new HTTPError('appId.required', 400);

        const service = await DeleteAppService(appId, userId);

        response.status(200).json(service);
    } catch (error: any) {
        console.log(error);
        return response
            .status(error.status ?? 500)
            .json({ error: error.message });
    }
}

export { DeleteAppController };