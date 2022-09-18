import { Request, Response } from 'express';
import { GetProfileService } from '@services/user/GetProfile';

async function GetProfileController(request: Request, response: Response) {
    const { userId, user } = request;

    try {
        const service = await GetProfileService(userId, user.isAuthByOAuth);

        response.status(200).json(service);
    } catch (error: any) {
        console.log(error);
        return response
            .status(error.status ?? 500)
            .json({ error: error.message });
    }
}

export { GetProfileController };
