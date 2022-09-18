import { HTTPError } from '@errors/HTTPError';
import prisma from '@prisma';
import { isUrl } from '@utils/checkUrl';
import { generateToken } from '@utils/genToken';

type Params = {
    name: string;
    description?: string;
    redirectUrl: string;
    homeUrl: string;
    userId: string;
};

async function CreateAppService(params: Params) {
    const { name, description, redirectUrl, homeUrl } = params;

    if (!isUrl(redirectUrl)) throw new HTTPError('redirectUrl.invalid', 400);
    if (!isUrl(homeUrl)) throw new HTTPError('homeUrl.invalid', 400);

    const clientId = await generateToken(16);
    const clientSecret = await generateToken(32);

    const app = await prisma.oAuthApp.create({
        data: {
            name,
            description,
            redirect_url: redirectUrl,
            home_url: homeUrl,
            clientId,
            clientSecret,
            authorId: params.userId,
        },
    });

    return app;
}

export { CreateAppService };
