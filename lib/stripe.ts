import Stripe from 'stripe'

// Server-side Stripe instance - only for API routes
let stripeInstance: Stripe | null = null

export const getServerStripe = (): Stripe => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required')
    }
    
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
  }
  
  return stripeInstance
}