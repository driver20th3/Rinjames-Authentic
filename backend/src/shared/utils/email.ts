import nodemailer, { Transporter } from 'nodemailer'
import { env } from '../../config/env'
import { logger } from './logger'

let transporter: Transporter | null = null

export const isEmailConfigured = (): boolean => Boolean(env.SMTP_HOST && env.SMTP_USER)

function getTransporter(): Transporter | null {
  if (!isEmailConfigured()) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
    })
  }
  return transporter
}

interface MailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Send an email. If SMTP is not configured, the message is logged instead so
 * flows (e.g. password reset) still work in development without a mail server.
 */
export async function sendEmail({ to, subject, html, text }: MailOptions): Promise<void> {
  const tx = getTransporter()
  if (!tx) {
    logger.warn(`[email:not-configured] To: ${to} | ${subject}\n${text || html}`)
    return
  }
  await tx.sendMail({ from: env.EMAIL_FROM, to, subject, html, text })
  logger.info(`Email sent to ${to}: ${subject}`)
}

export function passwordResetEmail(resetLink: string): { subject: string; html: string; text: string } {
  return {
    subject: 'Đặt lại mật khẩu — RinJames Authentic',
    text: `Bấm vào liên kết để đặt lại mật khẩu (hết hạn sau 1 giờ): ${resetLink}`,
    html: `
      <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>
      <p><a href="${resetLink}">Bấm vào đây để đặt lại mật khẩu</a> (liên kết hết hạn sau 1 giờ).</p>
      <p>Nếu không phải bạn, hãy bỏ qua email này.</p>
    `
  }
}
