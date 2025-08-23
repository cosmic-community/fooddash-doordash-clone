'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import type { CartSidebarProps } from '@/types'

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, getTotals, getRestaurantInfo, getItemCount } = useCart()
  const totals = getTotals()
  const { restaurant, hasMultipleRestaurants } = getRestaurantInfo()
  const itemCount = getItemCount()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Your Cart</h2>
              {itemCount > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {itemCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add some delicious items to get started!
                  </p>
                  <button
                    onClick={onClose}
                    className="btn btn-primary px-8 py-4"
                  >
                    Browse Menu
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Restaurant Info */}
                {restaurant && (
                  <div className="p-4 bg-gray-50 border-b flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {restaurant.metadata?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {restaurant.metadata?.delivery_time} • ${restaurant.metadata?.delivery_fee?.toFixed(2)} delivery
                        </p>
                      </div>
                      <Link
                        href={`/restaurants/${restaurant.slug}`}
                        onClick={onClose}
                        className="text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        View Menu
                      </Link>
                    </div>
                    {hasMultipleRestaurants && (
                      <p className="text-sm text-amber-600 mt-2">
                        ⚠️ Items from multiple restaurants - delivery fees may apply separately
                      </p>
                    )}
                  </div>
                )}

                {/* Cart Items - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                        {/* Item Image */}
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.menuItem.metadata?.food_image?.imgix_url ? (
                            <img
                              src={`${item.menuItem.metadata.food_image.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                              alt={item.menuItem.metadata?.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <span className="text-2xl">🍽️</span>
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">
                            {item.menuItem.metadata?.name}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {item.menuItem.metadata?.description}
                          </p>
                          {item.specialInstructions && (
                            <p className="text-xs text-gray-500 mt-1">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                          
                          {/* Quantity and Price */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                ${((item.menuItem.metadata?.price || 0) * item.quantity).toFixed(2)}
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary - Fixed at bottom */}
                <div className="border-t bg-white p-4 flex-shrink-0">
                  <div className="space-y-2 text-sm">
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
                  
                  {/* Checkout Button */}
                  <div className="mt-4 space-y-2">
                    <Link
                      href="/cart"
                      onClick={onClose}
                      className="w-full btn btn-primary px-6 py-4 flex items-center justify-center space-x-2"
                    >
                      <span>Go to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={onClose}
                      className="w-full text-center text-primary hover:text-primary-dark font-medium py-3"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}