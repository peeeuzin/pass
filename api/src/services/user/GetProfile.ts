import { HTTPError } from '@errors/HTTPError';
import prisma from '@prisma';

async function GetProfileService(userId: string) {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            name: true,
            username: true,
            email: true,
            id: true,
        },
    });

    if (!user) {
        throw new HTTPError('user.notFound', 404);
    }

    return user;
}

export { GetProfileService };
