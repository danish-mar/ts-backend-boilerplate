export enum Role {
    USER = 'user',
    ADMIN = 'admin',
}

export interface JWTPayload {
    sub: string;
    role: Role;
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: Role;
            };
        }
    }
}
