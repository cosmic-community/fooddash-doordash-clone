'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Clock, MapPin, Phone, Mail, ArrowLeft, Receipt } from 'lucide-react'
import Link from 'next/link'
import type { Order } from '@/types'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (!response.ok) {
          throw new Error('Order not found')
        }
        const data = await response.json()
        setOrder(data.order)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Unable to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The order you\'re looking for could not be found.'}</p>
          <Link
            href="/"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  const orderItems = order.metadata.order_items ? JSON.parse(order.metadata.order_items) : []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-4">
            Thank you for your order. We'll have it ready soon!
          </p>
          <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto shadow-sm border">
            <p className="text-lg font-semibold text-gray-900 mb-2">Order Number</p>
            <p className="text-2xl font-mono text-primary bg-gray-50 px-4 py-2 rounded-lg inline-block">
              #{order.metadata.order_number}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>Order Status</span>
              </h2>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{order.metadata.order_status}</p>
                  <p className="text-gray-600 text-sm">
                    Estimated delivery: {order.metadata.estimated_delivery_time || '30-45 minutes'}
                  </p>
                </div>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant Details</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏪</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{order.metadata.restaurant_name}</p>
                    <p className="text-gray-600 text-sm">Preparing your order</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Receipt className="w-5 h-5" />
                <span>Items Ordered</span>
              </h2>
              <div className="space-y-4">
                {orderItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🍽️</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                        {item.specialInstructions && (
                          <p className="text-gray-500 text-xs italic">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            {order.metadata.special_instructions && (
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Special Instructions</h2>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {order.metadata.special_instructions}
                </p>
              </div>
            )}
          </div>

          {/* Order Summary & Customer Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Total */}
            <div className="bg-white rounded-xl shadow-sm p-6 border sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.metadata.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${order.metadata.delivery_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${order.metadata.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                  <span>Total</span>
                  <span>${order.metadata.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Delivery Details</span>
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">{order.metadata.customer_name}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-gray-600">{order.metadata.customer_email}</p>
                </div>
                {order.metadata.customer_phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600">{order.metadata.customer_phone}</p>
                  </div>
                )}
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-gray-600">{order.metadata.delivery_address}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/"
                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors font-medium text-center block"
              >
                Order More Food
              </Link>
              <Link
                href="/"
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center block flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Confirmation Email Sent</span>
          </div>
          <p className="text-blue-700 text-sm">
            We've sent a confirmation email to <strong>{order.metadata.customer_email}</strong> with your order details.
            Check your inbox (and spam folder) for the receipt.
          </p>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderSuccessContent />
    </Suspense>
  )
}