import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json()

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Check payment status
    if (paymentIntent.status === 'succeeded') {
      // Here you would typically:
      // 1. Save the order to your database
      // 2. Send confirmation email
      // 3. Notify the restaurant
      // 4. Update inventory if applicable

      return NextResponse.json({
        success: true,
        orderId: paymentIntent.metadata.orderId,
        status: paymentIntent.status,
        amount: paymentIntent.amount_received,
      })
    } else {
      return NextResponse.json({
        success: false,
        status: paymentIntent.status,
        error: 'Payment not completed',
      })
    }

  } catch (error) {
    console.error('Error confirming payment:', error)
    
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}