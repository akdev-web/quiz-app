import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTTP_MAIL_ADDRESS,
        pass: process.env.SMTP_PASS_KEY,
    },
});

const code = () => {
    return Math.floor(10000 + Math.random() * 90000);

}

export default async function SendVeificationMail(sendto) {
   const  verfcode = code()
    try {
        const info = await transporter.sendMail({
            from: '"Charcha" <akayoffk@gmail.com>',
            to: sendto,
            subject: "Vefication Mail",
            text: "The code is valid for 5 min", // plain‑text body
            html:
                `<p>Your Vefication Code is <h1>${verfcode}<h1/><p/><p>This code is vlaid upto 5 mintues only</p>`, // HTML body
        });

        return {info:info.messageId,code:verfcode};
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
}
