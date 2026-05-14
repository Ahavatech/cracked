import nodemailer from 'nodemailer'
import { getRuntimeEnv } from '../config/env'

const env = getRuntimeEnv()

type Transporter = nodemailer.Transporter

let transporterPromise: Promise<Transporter> | undefined

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = createTransporter()
  }

  return transporterPromise
}

async function createTransporter(): Promise<Transporter> {
  if (env.smtpHost && env.smtpUser && env.smtpPass) {
    return nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: { user: env.smtpUser, pass: env.smtpPass }
    })
  }

  const testAccount = await nodemailer.createTestAccount()
  console.log('SMTP env not configured. Using Nodemailer test SMTP for local previews.')

  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  })
}

async function sendMail(options: nodemailer.SendMailOptions) {
  const transporter = await getTransporter()
  const info = await transporter.sendMail(options)
  const previewUrl = nodemailer.getTestMessageUrl(info)

  if (previewUrl) {
    console.log(`Email preview: ${previewUrl}`)
  }

  return info
}

export async function sendSetupEmail(to: string, token: string, type: 'member' | 'client') {
  const url = `${env.webUrl}/auth/setup?token=${token}&type=${type}`

  await sendMail({
    from: '"Cracked.dev" <hello@cracked.dev>',
    to,
    subject: 'Set up your Cracked.dev account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
        <h2>Welcome to Cracked.dev</h2>
        <p>Click the button below to set your password and activate your account. This link expires in <strong>48 hours</strong>.</p>
        <p><a href="${url}" style="display:inline-block;padding:12px 28px;border-radius:9999px;text-decoration:none;font-weight:600">Activate Account</a></p>
        <p>If you did not expect this email, ignore it.</p>
      </div>
    `
  })
}

export async function sendReviewInvite(to: string, reviewToken: string) {
  const url = `${env.webUrl}/reviews?rt=${reviewToken}`

  await sendMail({
    from: '"Cracked.dev" <hello@cracked.dev>',
    to,
    subject: 'Share your experience with Cracked.dev',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
        <h2>We would love your feedback</h2>
        <p>Thank you for working with us. Leave a short review; it takes less than a minute.</p>
        <p><a href="${url}" style="display:inline-block;padding:12px 28px;border-radius:9999px;text-decoration:none;font-weight:600">Write a Review</a></p>
      </div>
    `
  })
}

export async function sendContactNotification(message: {
  name: string
  email: string
  subject?: string
  body: string
}) {
  if (!env.smtpHost && !env.smtpUser && !env.smtpPass) {
    return
  }

  await sendMail({
    from: '"Cracked.dev" <hello@cracked.dev>',
    to: env.smtpUser,
    subject: message.subject || 'New Cracked.dev contact submission',
    text: `${message.name} <${message.email}>\n\n${message.body}`
  })
}
