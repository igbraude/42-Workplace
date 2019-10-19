import { createTransport } from 'nodemailer'

export const transport = createTransport({
    host: process.env.MAIL_HOST || 'localhost',
    port: process.env.MAIL_PORT || 1025,
})

export const appUrl = process.env.APP_URL || 'http://localhost:8080'

export const passwordRecoveryContent = code => ({
    html: `You just made a request to recover your password.<br>
             Follow this link to continue the procedure: <a href="${appUrl}/recovery-password/${code}">${appUrl}/recovery-password/${code}</a>`,
    subject: 'Hypertube - Password recovery',
})

export const emailConfirmationContent = code => ({
    html: `Yay! You just created you account!<br>
             Follow this link to confirm your email: <a href="${appUrl}/confirm-email/${code}">${appUrl}/confirm-email/${code}</a>`,
    subject: 'Hypertube - Confirm your email',
})
