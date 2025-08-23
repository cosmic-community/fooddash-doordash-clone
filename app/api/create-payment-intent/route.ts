import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import type { PaymentIntentData } from '@/types'

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY environment variable is not set')
      return NextResponse.json(
        { error: 'Payment system is not properly configured' },
        { status: 500 }
      )
    }

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

    if (!paymentIntent.client_secret) {
      throw new Error('Failed to create payment intent - no client secret returned')
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    
    // Check if it's a Stripe-specific error with proper type checking
    if (error && typeof error === 'object' && 'type' in error) {
      // Safely extract the message with proper type checking
      const errorMessage = error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' 
        ? error.message 
        : 'Unknown error'
        
      return NextResponse.json(
        { error: `Payment system error: ${errorMessage}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}