'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe-client'
import { useCart } from '@/contexts/CartContext'
import CheckoutForm from '@/components/CheckoutForm'
import StripePaymentForm from '@/components/StripePaymentForm'
import OrderConfirmationModal from '@/components/OrderConfirmationModal'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import type { CheckoutFormData, PaymentIntentData } from '@/types'

export default function CheckoutPage() {
  const { items, getTotals, getRestaurantInfo, clearCart } = useCart()
  const router = useRouter()
  
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [customerInfo, setCustomerInfo] = useState<CheckoutFormData | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null)

  const totals = getTotals()
  const { restaurant } = getRestaurantInfo()

  // Scroll to top utility function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Initialize Stripe promise
  useEffect(() => {
    try {
      const promise = getStripe()
      setStripePromise(promise)
    } catch (err) {
      console.error('Failed to initialize Stripe:', err)
      setError('Payment system is not properly configured. Please check your environment variables.')
    }
  }, [])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  // Create payment intent when moving to payment step
  const createPaymentIntent = async (formData: CheckoutFormData) => {
    setIsCreatingPayment(true)
    setError(null)

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const paymentData: PaymentIntentData = {
        amount: Math.round(totals.total * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId,
          customerEmail: formData.email,
          restaurantId: restaurant?.id || '',
          items: JSON.stringify(items.map(item => ({
            id: item.menuItem.id,
            name: item.menuItem.metadata?.name,
            quantity: item.quantity,
            price: item.menuItem.metadata?.price,
            image_url: item.menuItem.metadata?.food_image?.imgix_url, // Include food image URL
            specialInstructions: item.specialInstructions,
          }))),
        },
      }

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment intent')
      }

      const { clientSecret, paymentIntentId } = await response.json()
      
      if (!clientSecret) {
        throw new Error('Invalid payment intent response')
      }
      
      setClientSecret(clientSecret)
      setPaymentIntentId(paymentIntentId)
      setCustomerInfo(formData)
      setStep('payment')
      
      // Scroll to top when transitioning to payment step
      scrollToTop()
    } catch (err) {
      console.error('Error creating payment intent:', err)
      setError(err instanceof Error ? err.message : 'Failed to process checkout. Please try again.')
    } finally {
      setIsCreatingPayment(false)
    }
  }

  const handlePaymentSuccess = async () => {
    if (!paymentIntentId) return

    try {
      const response = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
      })

      const result = await response.json()

      if (result.success) {
        // Set the order number for the confirmation modal
        setConfirmedOrderNumber(result.orderId)
        
        // Show confirmation modal first
        setShowConfirmationModal(true)
        
        // Clear cart
        clearCart()
      } else {
        setError('Payment confirmation failed. Please contact support.')
      }
    } catch (err) {
      console.error('Error confirming payment:', err)
      setError('Payment confirmation failed. Please contact support.')
    }
  }

  const handleConfirmationModalClose = () => {
    setShowConfirmationModal(false)
    // Navigate to success page after modal is closed
    if (confirmedOrderNumber) {
      router.push(`/checkout/success?orderId=${confirmedOrderNumber}`)
    }
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
    scrollToTop() // Scroll to top to show error message
  }

  const handleBackToDetails = () => {
    setStep('details')
    scrollToTop() // Scroll to top when going back to details
  }

  if (items.length === 0) {
    return null // Will redirect via useEffect
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading payment system...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                href="/cart"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Cart</span>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              <div className={`flex items-center space-x-2 ${
                step === 'details' ? 'text-primary' : 'text-gray-500'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'details' 
                    ? 'bg-primary text-white' 
                    : customerInfo 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <span className="font-medium">Details</span>
              </div>
              
              <div className={`w-16 h-1 ${customerInfo ? 'bg-green-500' : 'bg-gray-300'}`} />
              
              <div className={`flex items-center space-x-2 ${
                step === 'payment' ? 'text-primary' : 'text-gray-500'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'payment' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                  {error.includes('environment variables') && (
                    <div className="mt-2 text-sm text-red-600">
                      <p>Make sure you have set the following environment variables:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (client-side)</li>
                        <li>STRIPE_SECRET_KEY (server-side only)</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {step === 'details' && (
                <CheckoutForm 
                  onSubmit={createPaymentIntent}
                  isSubmitting={isCreatingPayment}
                />
              )}

              {step === 'payment' && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    isLoading={isProcessingPayment}
                    setIsLoading={setIsProcessingPayment}
                    total={totals.total}
                  />
                </Elements>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Order Summary</span>
                </h2>

                {/* Restaurant Info */}
                {restaurant && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">{restaurant.metadata?.name}</h3>
                    <p className="text-sm text-gray-600">{restaurant.metadata?.address}</p>
                    <p className="text-sm text-gray-600">
                      Delivery: {restaurant.metadata?.delivery_time}
                    </p>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.menuItem.metadata?.food_image?.imgix_url ? (
                          <img
                            src={`${item.menuItem.metadata.food_image.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                            alt={item.menuItem.metadata?.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            🍽️
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">
                          {item.menuItem.metadata?.name}
                        </p>
                        <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900 text-sm">
                        ${((item.menuItem.metadata?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>${totals.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Customer Info (when in payment step) */}
                {step === 'payment' && customerInfo && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium text-gray-900 mb-3">Delivery Info</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{customerInfo.firstName} {customerInfo.lastName}</p>
                      <p>{customerInfo.email}</p>
                      <p>{customerInfo.address}</p>
                      <p>{customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}</p>
                    </div>
                    <button
                      onClick={handleBackToDetails}
                      className="text-primary hover:text-primary-dark text-sm mt-2 underline"
                    >
                      Edit Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleConfirmationModalClose}
        orderNumber={confirmedOrderNumber || undefined}
      />
    </>
  )
}