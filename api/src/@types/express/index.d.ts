// eslint-disable-next-line no-unused-vars
declare namespace Express {
    export interface Request {
        userId: string;
        user: {
            id: string;
            isAuthByOAuth: boolean;
            oauthApp?: {
                id: string;
            };
        };
    }
}
