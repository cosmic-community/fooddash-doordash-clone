import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createOrder } from '@/lib/cosmic'
import type { CreateOrderData } from '@/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
})

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

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Extract order data from payment intent metadata
    const metadata = paymentIntent.metadata
    const orderItems = metadata.items ? JSON.parse(metadata.items) : []

    // Calculate totals (amount is in cents)
    const totalAmount = paymentIntent.amount / 100
    const subtotal = orderItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const deliveryFee = 2.99 // Default delivery fee - could be dynamic
    const tax = totalAmount - subtotal - deliveryFee

    // Generate order number
    const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Create order data with correct format for Cosmic CMS
    const orderData: CreateOrderData = {
      metadata: {
        order_number: orderNumber,
        customer_email: metadata.customerEmail || '',
        customer_name: `${paymentIntent.shipping?.name || 'Customer'}`,
        customer_phone: paymentIntent.shipping?.phone || '',
        delivery_address: paymentIntent.shipping?.address ? 
          `${paymentIntent.shipping.address.line1}, ${paymentIntent.shipping.address.city}, ${paymentIntent.shipping.address.state} ${paymentIntent.shipping.address.postal_code}` : 
          'Address not provided',
        order_items: JSON.stringify(orderItems), // Store as JSON string
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        tax: tax,
        total_amount: totalAmount,
        payment_intent_id: paymentIntentId,
        order_status: 'Pending', // Use display value string, not object
        restaurant_id: metadata.restaurantId || '',
        restaurant_name: orderItems[0]?.restaurantName || 'Unknown Restaurant',
        special_instructions: paymentIntent.description || '',
        estimated_delivery_time: '30-45 minutes'
      }
    }

    // Create order in Cosmic CMS
    const order = await createOrder(orderData)

    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      orderId: order.metadata.order_number,
      order: order
    })

  } catch (error) {
    console.error('Error confirming payment:', error)
    
    return NextResponse.json(
      { error: 'Payment confirmation failed' },
      { status: 500 }
    )
  }
}