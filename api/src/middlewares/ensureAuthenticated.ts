import { Request, Response, NextFunction } from 'express';
import prisma from '@prisma';
import { verifyToken } from '@utils/verifyJWT';

export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({
            error: 'token.invalid',
        });
    }

    const [, token] = authToken.split(' ');

    const result = verifyToken(token);

    if (result) {
        const user = await prisma.user.findUnique({
            where: {
                id: result,
            },
        });

        if (!user)
            return response.status(401).json({
                error: 'unknown.user',
            });
        request.userId = result;

        return next();
    } else {
        return response.status(401).json({
            error: 'token.expired',
        });
    }
}
