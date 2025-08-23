import { NextRequest, NextResponse } from 'next/server'
import { getServerStripe } from '@/lib/stripe'
import { createOrder } from '@/lib/cosmic'
import { resend, EMAIL_CONFIG } from '@/lib/resend'
import type { CreateOrderData } from '@/types'

// Helper function to generate HTML email template
function generateOrderConfirmationHTML({
  orderNumber,
  customerName,
  customerEmail,
  restaurantName,
  orderItems,
  subtotal,
  deliveryFee,
  tax,
  totalAmount,
  deliveryAddress,
  estimatedDeliveryTime,
  specialInstructions
}: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  restaurantName: string;
  orderItems: any[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  deliveryAddress: string;
  estimatedDeliveryTime: string;
  specialInstructions?: string;
}) {
  const itemsHTML = orderItems.map(item => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
      <div style="flex: 1;">
        <div style="font-weight: bold; margin-bottom: 4px;">${item.name}</div>
        <div style="font-size: 14px; color: #666;">
          Quantity: ${item.quantity} × $${item.price.toFixed(2)}
        </div>
        ${item.specialInstructions ? `
          <div style="font-size: 12px; color: #888; font-style: italic; margin-top: 4px;">
            Note: ${item.specialInstructions}
          </div>
        ` : ''}
      </div>
      <div style="font-weight: bold; min-width: 80px; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation #${orderNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #FF6B35; font-size: 28px; margin-bottom: 10px;">🍽️ FoodDash</h1>
          <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;">Order Confirmed!</h2>
          <p style="color: #666; font-size: 16px;">Thank you for your order, ${customerName}!</p>
        </div>

        <!-- Order Details Box -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 15px;">Order Details</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <strong>Order Number:</strong>
            <span style="font-family: monospace; background-color: #FF6B35; color: white; padding: 2px 8px; border-radius: 4px;">
              #${orderNumber}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <strong>Restaurant:</strong>
            <span>${restaurantName}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <strong>Estimated Delivery:</strong>
            <span>${estimatedDeliveryTime}</span>
          </div>
        </div>

        <!-- Items Ordered -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 15px;">Items Ordered</h3>
          ${itemsHTML}
        </div>

        <!-- Order Total -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 15px;">Order Total</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Delivery Fee:</span>
            <span>$${deliveryFee.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Tax:</span>
            <span>$${tax.toFixed(2)}</span>
          </div>
          <hr style="margin: 12px 0; border: none; border-top: 2px solid #ddd;" />
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
            <span>Total:</span>
            <span>$${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <!-- Delivery Information -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 15px;">🚗 Delivery Information</h3>
          <div style="margin-bottom: 10px;">
            <strong>Delivering to:</strong><br />
            <span style="color: #666;">${deliveryAddress}</span>
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Contact:</strong><br />
            <span style="color: #666;">${customerEmail}</span>
          </div>
          ${specialInstructions ? `
            <div>
              <strong>Special Instructions:</strong><br />
              <span style="color: #666; font-style: italic;">${specialInstructions}</span>
            </div>
          ` : ''}
        </div>

        <!-- Order Tracking -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h3 style="color: #333; margin-bottom: 15px;">📱 Track Your Order</h3>
          <p style="color: #666; margin-bottom: 15px;">
            You can track your order status and get real-time updates by visiting our website.
          </p>
          <a 
            href="https://fooddash.cosmicjs.com"
            style="background-color: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;"
          >
            Track Order
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #888; font-size: 14px;">
          <p style="margin-bottom: 10px;">
            Thank you for choosing FoodDash! 🍕
          </p>
          <p style="margin-bottom: 5px;">
            Questions? Contact us at <a href="mailto:tony@cosmicjs.com" style="color: #FF6B35;">tony@cosmicjs.com</a>
          </p>
          <p style="font-size: 12px; color: #aaa;">
            This is an automated email. Please do not reply directly to this message.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getServerStripe()
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

    // Send confirmation email using HTML template
    try {
      const emailHtml = generateOrderConfirmationHTML({
        orderNumber: order.metadata.order_number,
        customerName: order.metadata.customer_name,
        customerEmail: order.metadata.customer_email,
        restaurantName: order.metadata.restaurant_name,
        orderItems: orderItems,
        subtotal: order.metadata.subtotal,
        deliveryFee: order.metadata.delivery_fee,
        tax: order.metadata.tax,
        totalAmount: order.metadata.total_amount,
        deliveryAddress: order.metadata.delivery_address,
        estimatedDeliveryTime: order.metadata.estimated_delivery_time || '30-45 minutes',
        specialInstructions: order.metadata.special_instructions
      })

      await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: order.metadata.customer_email,
        subject: `Order Confirmation #${order.metadata.order_number} - FoodDash`,
        html: emailHtml,
        replyTo: EMAIL_CONFIG.replyTo
      })

      console.log(`Confirmation email sent to ${order.metadata.customer_email} for order ${order.metadata.order_number}`)
    } catch (emailError) {
      // Log email error but don't fail the entire request
      console.error('Failed to send confirmation email:', emailError)
      // Order was created successfully, email failure shouldn't break the flow
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