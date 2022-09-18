import { HTTPError } from '@errors/HTTPError';
import prisma from '@prisma';
import { generateToken } from '@utils/genToken';

type Params = {
    clientId: string;
    userId: string;
};

async function AuthorizeService(params: Params) {
    const { clientId, userId } = params;

    const app = await prisma.oAuthApp.findFirst({
        where: {
            clientId,
        },
    });

    if (!app) {
        throw new HTTPError('oauthapp.notFound', 404);
    }

    const { code } = await prisma.oAuthAuthorization.create({
        data: {
            app: {
                connect: {
                    id: app.id,
                },
            },
            user: {
                connect: {
                    id: userId,
                },
            },
            code: await generateToken(16),
        },
    });

    return {
        code,
        redirectUrl: app.redirect_url,
    };
}

export { AuthorizeService };
