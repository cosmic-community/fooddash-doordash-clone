'use client'

import { useState } from 'react'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import type { AddToCartButtonProps } from '@/types'

export default function AddToCartButton({ 
  menuItem, 
  className = '',
  variant = 'default' 
}: AddToCartButtonProps) {
  const { addItem, items } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  // Check if item is already in cart
  const existingItem = items.find(item => item.menuItem.id === menuItem.id)
  const isInCart = !!existingItem

  const handleAddToCart = async () => {
    if (!menuItem.metadata?.available) {
      return
    }

    setIsAdding(true)
    
    try {
      addItem(menuItem, quantity)
      
      // Reset quantity after adding
      setQuantity(1)
      
      // Brief loading state for feedback
      setTimeout(() => {
        setIsAdding(false)
      }, 500)
    } catch (error) {
      console.error('Error adding item to cart:', error)
      setIsAdding(false)
    }
  }

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10)) // Max 10 items
  }

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1))
  }

  if (!menuItem.metadata?.available) {
    return (
      <div className={`text-center ${className}`}>
        <button 
          disabled
          className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
        >
          Unavailable
        </button>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <span className="font-semibold text-lg text-gray-900">
          ${menuItem.metadata?.price?.toFixed(2)}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isAdding
              ? 'bg-green-100 text-green-800'
              : isInCart
                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>{isInCart ? 'Add More' : 'Add'}</span>
            </>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Price */}
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">
          ${menuItem.metadata?.price?.toFixed(2)}
        </span>
        {isInCart && (
          <span className="text-sm text-primary font-medium">
            In cart ({existingItem?.quantity})
          </span>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center space-x-3">
          <button
            onClick={decrementQuantity}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={incrementQuantity}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
          isAdding
            ? 'bg-green-500 text-white cursor-wait'
            : 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg'
        }`}
      >
        {isAdding ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Adding to Cart...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  )
}