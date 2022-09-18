import { HTTPError } from '@errors/HTTPError';
import prisma from '@prisma';
import { Secret, sign } from 'jsonwebtoken';
import ms from 'ms';
import { createConnection } from '@amqp';
import { jsonbuf } from '@utils/jsonbuf';

type Params = {
    clientId: string;
    clientSecret: string;
    code: string;
};
async function AccessTokenService(params: Params) {
    const { clientId, clientSecret, code } = params;

    const app = await prisma.oAuthApp.findFirst({
        where: {
            clientId,
            clientSecret,
        },
    });

    if (!app) {
        throw new HTTPError('oauthapp.notFound', 404);
    }

    const authorization = await prisma.oAuthAuthorization.findFirst({
        where: {
            code,
            app: {
                id: app.id,
            },
        },
    });

    if (!authorization) {
        throw new HTTPError('code.invalid', 401);
    }

    if (authorization.createdAt < new Date(Date.now() - ms('10m'))) {
        throw new HTTPError('code.expired', 401);
    }

    await prisma.oAuthAuthorization.delete({
        where: {
            id: authorization.id,
        },
    });

    // --
    const amqp = await createConnection();
    const channel = await amqp.createChannel();
    channel.sendToQueue(
        'new_oauth',
        jsonbuf({
            user_id: authorization.userId,
        })
    );

    channel.assertQueue('oauth_authorize');

    await new Promise<undefined>((resolve) => {
        channel.consume(
            'oauth_authorize',
            (message) => {
                if (!message) {
                    return;
                }

                const data = JSON.parse(message.content.toString());

                if (data.user_id === authorization.userId) {
                    resolve(undefined);
                    channel.ack(message);
                }
            },
            {
                consumerTag: 'pass_api',
            }
        );
    });

    await prisma.oAuthApp.update({
        where: {
            id: app.id,
        },
        data: {
            users: {
                connect: {
                    id: authorization.userId,
                },
            },
        },
    });

    const token = sign(
        {
            user: {
                id: authorization.userId,
                oauthApp: {
                    id: app.id,
                },
            },
        },
        process.env.JWT_SECRET as Secret,
        {
            subject: authorization.userId,
            expiresIn: '30d',
        }
    );

    return {
        accessToken: token,
    };
}

export { AccessTokenService };
