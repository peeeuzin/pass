import { Secret, verify } from 'jsonwebtoken';

interface IPayload {
    sub: string;
}

export function verifyToken(token: string) {
    try {
        const { sub } = verify(
            token,
            process.env.JWT_SECRET as Secret
        ) as IPayload;

        return sub;
    } catch (error) {
        return null;
    }
}
