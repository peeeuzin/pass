import { HTTPError } from '@errors/HTTPError';
import prisma from '@prisma';

async function GetAppService(appId: string) {
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

        select: {
            author: {
                select: {
                    username: true,
                    email: true,
                    createdAt: true,
                    id: true,
                    name: true,
                },
            },
            users: {
                select: {
                    id: true,
                },
            },
            id: true,
            name: true,
            description: true,
            redirect_url: true,
            home_url: true,
            clientId: true,
            createdAt: true,
        },
    });

    if (!app) {
        throw new HTTPError('oauthapp.notFound', 404);
    }

    const { users, ...rest } = app;

    return {
        ...rest,
        users: users.length,
    };
}

export { GetAppService };
