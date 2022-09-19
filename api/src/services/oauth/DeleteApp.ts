import { HTTPError } from '@errors/HTTPError';
import prisma from '@prisma';

async function DeleteAppService(
    appId: string,
    userId: string,
    isAuthByOAuth: boolean
) {
    if (isAuthByOAuth) {
        throw new HTTPError('user.authByOAuth', 401);
    }

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

    await prisma.oAuthApp.delete({
        where: {
            id: app.id,
        },
    });

    return {
        message: 'oauthapp.deleted',
    };
}

export { DeleteAppService };
