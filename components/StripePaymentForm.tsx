'use client'

import { useState } from 'react'
import { 
  PaymentElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js'
import { CreditCard, Lock } from 'lucide-react'

interface StripePaymentFormProps {
  onSuccess: () => void
  onError: (error: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  total: number
}

export default function StripePaymentForm({
  onSuccess,
  onError,
  isLoading,
  setIsLoading,
  total
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setPaymentError(null)

    try {
      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        console.error('Payment failed:', error)
        setPaymentError(error.message || 'Payment failed. Please try again.')
        onError(error.message || 'Payment failed')
      } else {
        onSuccess()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setPaymentError('An unexpected error occurred. Please try again.')
      onError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
        <Lock className="w-4 h-4 text-green-600" />
        <span className="text-sm text-green-600">Secure</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stripe Payment Element */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <PaymentElement 
            options={{
              layout: 'tabs',
            }}
          />
        </div>

        {/* Payment Error */}
        {paymentError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{paymentError}</p>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Lock className="w-4 h-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>

        {/* Payment Button */}
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className={`w-full py-4 px-6 rounded-lg font-medium transition-all ${
            isLoading || !stripe
              ? 'bg-gray-400 text-white cursor-wait'
              : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing Payment...</span>
            </div>
          ) : (
            `Pay $${total.toFixed(2)}`
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By placing your order, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    </div>
  )
}