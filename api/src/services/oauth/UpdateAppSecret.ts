import { HTTPError } from '@errors/HTTPError';
import prisma from '@prisma';
import { generateToken } from '@utils/genToken';

async function UpdateAppSecretService(appId: string, userId: string) {
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

    const clientSecret = await generateToken(32);

    const newApp = await prisma.oAuthApp.update({
        where: {
            id: app.id,
        },
        data: {
            clientSecret,
        },
    });

    return {
        clientSecret: newApp.clientSecret,
    };
}

export { UpdateAppSecretService };
