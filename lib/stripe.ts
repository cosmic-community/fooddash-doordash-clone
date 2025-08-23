import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export const getStripe = () => {
  return import('@stripe/stripe-js').then(module => 
    module.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
  )
}