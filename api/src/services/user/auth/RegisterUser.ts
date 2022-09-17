import { HTTPError } from '@errors/HTTPError';
import bcrypt from 'bcrypt';
import prisma from '@prisma';
import { Secret, sign } from 'jsonwebtoken';

type Params = {
    email: string;
    username: string;
    password: string;
    name?: string;
};

async function RegisterUserService(params: Params) {
    const { email, username, password, name } = params;

    const maybeAlreadyExists = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    email,
                },
                {
                    username,
                },
            ],
        },
    });

    if (maybeAlreadyExists) {
        throw new HTTPError('user.alreadyExists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            email,
            username,
            password: hashPassword,
            name,
        },
    });

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

export { RegisterUserService };
