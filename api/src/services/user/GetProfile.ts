import { HTTPError } from '@errors/HTTPError';
import prisma from '@prisma';

async function GetProfileService(userId: string, isAuthByOAuth: boolean) {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            name: true,
            username: true,
            email: true,
            id: true,

            authApps: !isAuthByOAuth
                ? {
                      select: {
                          id: true,
                          name: true,
                          description: true,
                          redirect_url: true,
                          home_url: true,
                          clientId: true,
                          createdAt: true,
                      },
                  }
                : false,
        },
    });

    if (!user) {
        throw new HTTPError('user.notFound', 404);
    }

    return user;
}

export { GetProfileService };
