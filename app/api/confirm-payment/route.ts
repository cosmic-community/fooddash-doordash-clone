import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createOrder } from '@/lib/cosmic'
import { Resend } from 'resend'
import type { CreateOrderData, CartItem } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json()

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment has not succeeded' },
        { status: 400 }
      )
    }

    // Extract data from payment intent metadata
    const metadata = paymentIntent.metadata
    const orderId = metadata.orderId
    const customerEmail = metadata.customerEmail
    const restaurantId = metadata.restaurantId
    const items: CartItem[] = JSON.parse(metadata.items || '[]')

    // Calculate totals from payment intent
    const totalAmount = paymentIntent.amount / 100 // Convert from cents
    const subtotal = totalAmount * 0.85 // Approximate calculation (adjust based on your tax/fee structure)
    const deliveryFee = totalAmount * 0.10
    const tax = totalAmount * 0.05

    // Get customer info from payment intent (you might want to store this differently)
    const billingDetails = paymentIntent.latest_charge 
      ? await stripe.charges.retrieve(paymentIntent.latest_charge as string)
      : null
    
    const customerName = billingDetails?.billing_details?.name || 'Unknown Customer'
    const customerPhone = billingDetails?.billing_details?.phone || ''

    // Create full address string
    const address = billingDetails?.billing_details?.address
    const deliveryAddress = address 
      ? `${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city}, ${address.state} ${address.postal_code}`
      : 'No address provided'

    // Create order data
    const orderData: CreateOrderData = {
      title: `Order ${orderId}`,
      type: 'orders',
      metadata: {
        order_number: orderId,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        order_items: JSON.stringify(items.map(item => ({
          id: item.menuItem.id,
          name: item.menuItem.metadata?.name,
          price: item.menuItem.metadata?.price,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions
        }))),
        subtotal,
        delivery_fee: deliveryFee,
        tax,
        total_amount: totalAmount,
        payment_intent_id: paymentIntentId,
        order_status: 'Pending' as const,
        restaurant_id: restaurantId || '',
        restaurant_name: items[0]?.menuItem?.metadata?.restaurant?.metadata?.name || 'Unknown Restaurant',
        special_instructions: '', // You might want to extract this from items
        estimated_delivery_time: '30-45 minutes'
      }
    }

    // Save order to Cosmic CMS
    const savedOrder = await createOrder(orderData)

    if (!savedOrder) {
      throw new Error('Failed to save order')
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: 'FoodDash <orders@fooddash.com>',
        to: [customerEmail],
        subject: `Order Confirmation - ${orderId}`,
        html: generateOrderConfirmationEmail({
          orderNumber: orderId,
          customerName,
          items,
          subtotal,
          deliveryFee,
          tax,
          total: totalAmount,
          restaurantName: orderData.metadata.restaurant_name,
          deliveryAddress,
          estimatedDeliveryTime: '30-45 minutes'
        })
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      orderId,
      order: savedOrder
    })

  } catch (error) {
    console.error('Error confirming payment:', error)
    
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}

function generateOrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  deliveryFee,
  tax,
  total,
  restaurantName,
  deliveryAddress,
  estimatedDeliveryTime
}: {
  orderNumber: string
  customerName: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  restaurantName: string
  deliveryAddress: string
  estimatedDeliveryTime: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #FF6B35; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .items-table th { background: #f5f5f5; font-weight: bold; }
        .total-row { font-weight: bold; font-size: 18px; }
        .status-badge { background: #FF6B35; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍕 Order Confirmed!</h1>
          <p>Thank you for your order, ${customerName}</p>
        </div>
        
        <div class="content">
          <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Restaurant:</strong> ${restaurantName}</p>
            <p><strong>Status:</strong> <span class="status-badge">Preparing</span></p>
            <p><strong>Estimated Delivery:</strong> ${estimatedDeliveryTime}</p>
            <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
          </div>

          <h3>Items Ordered</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.menuItem.metadata?.name || 'Unknown Item'}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.menuItem.metadata?.price || 0).toFixed(2)}</td>
                  <td>$${((item.menuItem.metadata?.price || 0) * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="order-details">
            <table class="items-table">
              <tr>
                <td>Subtotal</td>
                <td>$${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Delivery Fee</td>
                <td>$${deliveryFee.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Tax</td>
                <td>$${tax.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Total</strong></td>
                <td><strong>$${total.toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>

          <p>We're preparing your order now! You'll receive updates as your order progresses.</p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Questions about your order? Contact us at support@fooddash.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}