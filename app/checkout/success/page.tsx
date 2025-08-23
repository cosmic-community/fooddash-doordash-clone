'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams?.get('orderId')

  const [orderDetails] = useState({
    orderId: orderId || 'N/A',
    estimatedDelivery: '25-35 min',
    status: 'confirmed',
    total: 0, // This would normally come from the order data
  })

  useEffect(() => {
    if (!orderId) {
      // Redirect to home if no order ID
      router.push('/')
    }
  }, [orderId, router])

  if (!orderId) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We're preparing your delicious meal!
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-mono font-medium text-gray-900">
                #{orderDetails.orderId.toUpperCase()}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">
              Estimated Delivery
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                {orderDetails.estimatedDelivery}
              </p>
              <p className="text-gray-600">
                We'll send you updates via email
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Preparing your order</p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full w-1/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Tracking Steps */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Track Your Order
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Order Confirmed</p>
                <p className="text-sm text-gray-600">Just now</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="font-medium text-gray-900">Preparing Order</p>
                <p className="text-sm text-gray-600">Restaurant is preparing your food</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
              <div>
                <p className="font-medium text-gray-500">Out for Delivery</p>
                <p className="text-sm text-gray-400">Driver will pick up your order</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
              <div>
                <p className="font-medium text-gray-500">Delivered</p>
                <p className="text-sm text-gray-400">Enjoy your meal!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Need Help?
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Customer Support</p>
                <p className="text-sm text-gray-600">(555) 123-FOOD</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Order Issues</p>
                <p className="text-sm text-gray-600">We're here to help with any problems</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors text-center"
          >
            Order Again
          </Link>
          <Link
            href="/restaurants"
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
          >
            Browse Restaurants
          </Link>
        </div>

        {/* Order Confirmation Email Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            A confirmation email has been sent to your email address with order details and receipt.
          </p>
        </div>
      </div>
    </div>
  )
}