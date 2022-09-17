import { CreateAppService } from '@services/oauth/CreateApp';
import { Request, Response } from 'express';
import { HTTPError } from '@errors/HTTPError';

async function CreateAppController(request: Request, response: Response) {
    const { name, description, redirectUrl, homeUrl } = request.body;
    const { userId } = request;

    try {
        if (!name) throw new HTTPError('name.required', 400);
        if (!redirectUrl) throw new HTTPError('redirectUrl.required', 400);
        if (!homeUrl) throw new HTTPError('homeUrl.required', 400);

        const service = await CreateAppService({
            name,
            description,
            redirectUrl,
            homeUrl,
            userId,
        });

        response.status(200).json(service);
    } catch (error: any) {
        console.log(error);
        return response
            .status(error.status ?? 500)
            .json({ error: error.message });
    }
}

export { CreateAppController };
