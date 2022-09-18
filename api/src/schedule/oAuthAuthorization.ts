import scheduler from 'node-schedule';
import prisma from '@prisma';
import ms from 'ms';

scheduler.scheduleJob('* 10 * * * *', async () => {
    const auths = await prisma.oAuthAuthorization.findMany({
        where: {
            createdAt: {
                lte: new Date(Date.now() - ms('10m')),
            },
        },
    });

    if (auths.length === 0) {
        return;
    }

    await prisma.oAuthAuthorization.deleteMany({
        where: {
            id: {
                in: auths.map((auth) => auth.id),
            },
        },
    });
});
