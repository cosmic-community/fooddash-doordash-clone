import { Resend } from 'resend'

// Validate environment variable
const apiKey = process.env.RESEND_API_KEY

if (!apiKey) {
  throw new Error('RESEND_API_KEY environment variable is required')
}

export const resend = new Resend(apiKey)

// Email configuration
export const EMAIL_CONFIG = {
  from: 'tony@cosmicjs.com',
  replyTo: 'tony@cosmicjs.com'
} as const