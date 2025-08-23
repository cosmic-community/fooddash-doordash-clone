import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import type { PaymentIntentData } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: PaymentIntentData = await req.json()
    const { amount, currency, metadata } = body

    // Validate the amount (minimum $0.50 for Stripe)
    if (amount < 50) {
      return NextResponse.json(
        { error: 'Amount must be at least $0.50' },
        { status: 400 }
      )
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Stripe expects amount in cents
      currency: currency || 'usd',
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}