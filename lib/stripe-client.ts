let stripePromise: Promise<any> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is required')
    }
    
    stripePromise = import('@stripe/stripe-js').then(module => {
      return module.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    })
  }
  return stripePromise
}