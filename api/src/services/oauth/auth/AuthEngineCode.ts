import { createConnection } from '@amqp';
import { HTTPError } from '@errors/HTTPError';
import { jsonbuf } from '@utils/jsonbuf';

type Params = {
    code: string;
    userId: string;
    isAuthByOAuth: boolean;
};

async function AuthEngineCodeService(params: Params) {
    const { code, userId, isAuthByOAuth } = params;

    if (isAuthByOAuth) {
        throw new HTTPError('user.authByOAuth', 401);
    }

    const amqp = await createConnection();
    const channel = await amqp.createChannel();

    channel.sendToQueue(
        'user_authorize',
        jsonbuf({
            user_id: userId,
            code,
        })
    );

    return {
        message: 'ok',
    };
}

export { AuthEngineCodeService };
