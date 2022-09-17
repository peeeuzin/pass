import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@utils/verifyJWT';

export function ensureAuthenticated(
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
        request.userId = result;

        return next();
    } else {
        return response.status(401).json({
            error: 'token.expired',
        });
    }
}
