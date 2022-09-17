import crypto from 'crypto';

async function generateToken(length?: number) {
    return crypto.randomBytes(length ?? 32).toString('hex');
}

export { generateToken };
