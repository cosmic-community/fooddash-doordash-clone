interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  restaurantName: string;
  orderItems: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  deliveryAddress: string;
  estimatedDeliveryTime: string;
  specialInstructions?: string;
}

export function OrderConfirmationEmail({
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
}: OrderConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#FF6B35', fontSize: '28px', marginBottom: '10px' }}>🍽️ FoodDash</h1>
        <h2 style={{ color: '#333', fontSize: '24px', marginBottom: '10px' }}>Order Confirmed!</h2>
        <p style={{ color: '#666', fontSize: '16px' }}>Thank you for your order, {customerName}!</p>
      </div>

      {/* Order Details Box */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Order Details</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <strong>Order Number:</strong>
          <span style={{ fontFamily: 'monospace', backgroundColor: '#FF6B35', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>
            #{orderNumber}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <strong>Restaurant:</strong>
          <span>{restaurantName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <strong>Estimated Delivery:</strong>
          <span>{estimatedDeliveryTime}</span>
        </div>
      </div>

      {/* Items Ordered */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Items Ordered</h3>
        {orderItems.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '12px 0', 
            borderBottom: index < orderItems.length - 1 ? '1px solid #eee' : 'none' 
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.name}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Quantity: {item.quantity} × ${item.price.toFixed(2)}
              </div>
              {item.specialInstructions && (
                <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic', marginTop: '4px' }}>
                  Note: {item.specialInstructions}
                </div>
              )}
            </div>
            <div style={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Order Total */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Order Total</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Delivery Fee:</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <hr style={{ margin: '12px 0', border: 'none', borderTop: '2px solid #ddd' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Information */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>🚗 Delivery Information</h3>
        <div style={{ marginBottom: '10px' }}>
          <strong>Delivering to:</strong><br />
          <span style={{ color: '#666' }}>{deliveryAddress}</span>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Contact:</strong><br />
          <span style={{ color: '#666' }}>{customerEmail}</span>
        </div>
        {specialInstructions && (
          <div>
            <strong>Special Instructions:</strong><br />
            <span style={{ color: '#666', fontStyle: 'italic' }}>{specialInstructions}</span>
          </div>
        )}
      </div>

      {/* Order Tracking */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>📱 Track Your Order</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          You can track your order status and get real-time updates by visiting our website.
        </p>
        <a 
          href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://fooddash.cosmicjs.com'}`}
          style={{
            backgroundColor: '#FF6B35',
            color: 'white',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          Track Order
        </a>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid #eee', color: '#888', fontSize: '14px' }}>
        <p style={{ marginBottom: '10px' }}>
          Thank you for choosing FoodDash! 🍕
        </p>
        <p style={{ marginBottom: '5px' }}>
          Questions? Contact us at <a href="mailto:tony@cosmicjs.com" style={{ color: '#FF6B35' }}>tony@cosmicjs.com</a>
        </p>
        <p style={{ fontSize: '12px', color: '#aaa' }}>
          This is an automated email. Please do not reply directly to this message.
        </p>
      </div>
    </div>
  )
}