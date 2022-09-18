import { HTTPError } from '@errors/HTTPError';
import prisma from '@prisma';

type Params = {
    name: string;
    description?: string;
    redirectUrl: string;
    homeUrl: string;
};

async function UpdateAppService(appId: string, userId: string, params: Params) {
    const app = await prisma.oAuthApp.findFirst({
        where: {
            OR: [
                {
                    id: appId,
                },
                {
                    clientId: appId,
                },
            ],
        },
    });

    if (!app) {
        throw new HTTPError('oauthapp.notFound', 404);
    }

    if (app.authorId !== userId) {
        throw new HTTPError('oauthapp.notAuthorized', 403);
    }

    const { name, description, redirectUrl, homeUrl } = params;

    const newApp = await prisma.oAuthApp.update({
        where: {
            id: app.id,
        },
        data: {
            name,
            description,
            redirect_url: redirectUrl,
            home_url: homeUrl,
        },
    });

    return newApp;
}

export { UpdateAppService };
