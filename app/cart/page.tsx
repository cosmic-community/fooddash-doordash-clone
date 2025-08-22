'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotals, getRestaurantInfo } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const totals = getTotals()
  const { restaurant, hasMultipleRestaurants } = getRestaurantInfo()

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real app, this would integrate with a payment processor
    alert('Checkout functionality would be implemented here!')
    setIsProcessing(false)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-8" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet. Explore our restaurants and find something delicious!
          </p>
          <Link
            href="/restaurants"
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <span>Browse Restaurants</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/restaurants"
            className="flex items-center text-primary hover:text-primary-dark"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-card">
              {/* Cart Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">Your Order</h1>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
                
                {/* Restaurant Info */}
                {restaurant && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {restaurant.metadata?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {restaurant.metadata?.delivery_time} • {restaurant.metadata?.address}
                        </p>
                      </div>
                      <Link
                        href={`/restaurants/${restaurant.slug}`}
                        className="text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        View Menu
                      </Link>
                    </div>
                    {hasMultipleRestaurants && (
                      <p className="text-sm text-amber-600 mt-2 p-2 bg-amber-50 rounded">
                        ⚠️ Your cart contains items from multiple restaurants. Each restaurant will have separate delivery fees.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div className="p-6">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4">
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.menuItem.metadata?.food_image?.imgix_url ? (
                          <img
                            src={`${item.menuItem.metadata.food_image.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                            alt={item.menuItem.metadata?.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-3xl">🍽️</span>
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {item.menuItem.metadata?.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {item.menuItem.metadata?.description}
                        </p>
                        {item.specialInstructions && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Note:</span> {item.specialInstructions}
                          </p>
                        )}
                        
                        {/* Price per item */}
                        <p className="text-sm text-gray-500 mt-2">
                          ${item.menuItem.metadata?.price?.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity and Total */}
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center space-x-3 mb-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="font-semibold text-lg text-gray-900">
                          ${((item.menuItem.metadata?.price || 0) * item.quantity).toFixed(2)}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    {totals.deliveryFee === 0 ? 'Free' : `$${totals.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${totals.tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Minimum Order Check */}
              {restaurant && totals.subtotal < restaurant.metadata?.minimum_order && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Minimum order of ${restaurant.metadata?.minimum_order?.toFixed(2)} required. 
                    Add ${(restaurant.metadata?.minimum_order - totals.subtotal).toFixed(2)} more.
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing || (restaurant && totals.subtotal < restaurant.metadata?.minimum_order)}
                className={`w-full mt-6 flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-semibold text-lg transition-all ${
                  isProcessing
                    ? 'bg-gray-400 cursor-wait'
                    : restaurant && totals.subtotal < restaurant.metadata?.minimum_order
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Estimated delivery: {restaurant?.metadata?.delivery_time || '30-45 min'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}