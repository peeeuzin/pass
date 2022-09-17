import { HTTPError } from '@errors/HTTPError';
import prisma from '@prisma';
import bcrypt from 'bcrypt';
import { Secret, sign } from 'jsonwebtoken';

type Params = {
    email?: string;
    username?: string;
    password: string;
};

async function LoginUserService(params: Params) {
    let user = null;
    if (params.email) {
        user = await prisma.user.findFirst({
            where: {
                email: params.email,
            },
        });
    } else {
        user = await prisma.user.findFirst({
            where: {
                username: params.username,
            },
        });
    }

    if (!user) {
        throw new HTTPError('user.notFound', 404);
    }

    const userPassword = user.password;

    const isPasswordCorrect = bcrypt.compareSync(userPassword, params.password);

    if (!isPasswordCorrect) {
        throw new HTTPError('password.incorrect', 400);
    }

    const token = sign(
        {
            user: {
                name: user.name,
                id: user.id,
            },
        },
        process.env.JWT_SECRET as Secret,
        {
            expiresIn: '30d',
            subject: user.id,
        }
    );

    return { token, user };
}

export { LoginUserService };
