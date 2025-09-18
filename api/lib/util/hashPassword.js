import bcrypt from 'bcryptjs';

export default async function hashPassword(password){
    const hasdedPassword = await bcrypt.hash(password,10);
    return hasdedPassword;
}