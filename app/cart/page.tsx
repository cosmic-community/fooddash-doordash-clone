'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Minus, Plus, X, ArrowLeft, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import type { CartItem } from '@/types'

interface CartItemComponentProps {
  item: CartItem
}

function CartItemComponent({ item }: CartItemComponentProps) {
  const { updateQuantity, removeItem } = useCart()
  const { menuItem, quantity, id } = item
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const itemTotal = (menuItem.metadata?.price || 0) * quantity
  const restaurantName = menuItem.metadata?.restaurant?.metadata?.name || 'Unknown Restaurant'
  const foodImage = menuItem.metadata?.food_image
  const isVegetarian = menuItem.metadata?.is_vegetarian ?? false
  const isSpicy = menuItem.metadata?.is_spicy ?? false

  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-200">
      {/* Food Image */}
      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
        {foodImage?.imgix_url ? (
          <img
            src={`${foodImage.imgix_url}?w=128&h=128&fit=crop&auto=format,compress`}
            alt={menuItem.metadata?.name || menuItem.title}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            🍽️
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 truncate">
              {menuItem.metadata?.name || menuItem.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {restaurantName}
            </p>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {menuItem.metadata?.description}
            </p>
            
            {/* Dietary Tags */}
            <div className="flex items-center space-x-2 mt-2">
              {isVegetarian && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Vegetarian
                </span>
              )}
              {isSpicy && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  🌶️ Spicy
                </span>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeItem(id)}
            className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-medium min-w-[2rem] text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="font-semibold text-lg text-gray-900">
            ${itemTotal.toFixed(2)}
          </span>
        </div>

        {/* Special Instructions */}
        {item.specialInstructions && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Special instructions:</span> {item.specialInstructions}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CartPage() {
  const { items, clearCart, getTotals, getRestaurantInfo } = useCart()
  
  const totals = getTotals()
  const { restaurant, hasMultipleRestaurants } = getRestaurantInfo()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some delicious items to your cart to get started.
            </p>
            <Link
              href="/restaurants"
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Cart Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Items ({items.length})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
                
                {/* Restaurant Info */}
                {restaurant && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        🏪
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {restaurant.metadata?.name || restaurant.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {restaurant.metadata?.address}
                        </p>
                        {restaurant.metadata?.delivery_time && (
                          <p className="text-sm text-gray-500">
                            Delivery: {restaurant.metadata.delivery_time}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {hasMultipleRestaurants && (
                      <div className="mt-3 p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
                        ⚠️ Items from multiple restaurants. Additional delivery fees may apply.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <CartItemComponent item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    {totals.deliveryFee === 0 ? 'Free' : `$${totals.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${totals.tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Minimum Order Check */}
              {restaurant && restaurant.metadata?.minimum_order && totals.subtotal < restaurant.metadata.minimum_order && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                  Minimum order of ${restaurant.metadata.minimum_order.toFixed(2)} required.
                  Add ${(restaurant.metadata.minimum_order - totals.subtotal).toFixed(2)} more.
                </div>
              )}

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className={`block w-full py-4 px-6 rounded-lg font-medium text-center transition-all ${
                  (restaurant?.metadata?.minimum_order && totals.subtotal < restaurant.metadata.minimum_order)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
                    : 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg'
                }`}
              >
                Proceed to Checkout • ${totals.total.toFixed(2)}
              </Link>

              {/* Restaurant Info */}
              {restaurant && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>Estimated delivery:</span>
                      <span className="font-medium text-gray-900">
                        {restaurant.metadata?.delivery_time || '30-45 min'}
                      </span>
                    </div>
                    {restaurant.metadata?.phone && (
                      <div className="flex justify-between">
                        <span>Restaurant phone:</span>
                        <span className="font-medium text-gray-900">
                          {restaurant.metadata.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}