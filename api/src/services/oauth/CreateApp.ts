import prisma from '@prisma';
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

    const clientId = await generateToken(32);
    const clientSecret = await generateToken(64);

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
