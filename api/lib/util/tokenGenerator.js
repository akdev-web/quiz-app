import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function getLoggedInToken(userId) {
    const id = userId.toString();
    const token = await bcrypt.hash(id, 10);
    // console.log(token);
    return jwt.sign({ token }, process.env.LOGIN_TOKEN_SECRET, { expiresIn: '30d' });
}

export async function getAccessToken(userId) {
    const id = userId.toString();
    const token = await bcrypt.hash(id, 10);
    // console.log(token);
    return jwt.sign({ token }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export function getUserJwtToken(user) {
    return jwt.sign({ user }, process.env.USER_TOKEN_SECRET, { expiresIn: '30d' });
}

export function getRefreshToken(user) { ///only for authentication at registeration
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' });

}

const defaultCookieOptions = {
        httpOnly: true,
        path: '/',
        maxAge: 15 * 60 * 1000,
        sameSite: 'lax',
        secure: false,
}
export function cookiesOptions(overrides ={}) {
    return {
        ...defaultCookieOptions,
        ...overrides
    }
}