'use client'

import { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface OrderConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  orderNumber?: string
}

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  orderNumber
}: OrderConfirmationModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Content */}
        <div className="p-8 text-center">
          {/* Success animation */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            {/* Confetti-like decoration */}
            <div className="absolute -top-2 -right-2 text-2xl animate-pulse">🎉</div>
            <div className="absolute -top-1 -left-3 text-lg animate-bounce delay-100">✨</div>
            <div className="absolute -bottom-1 -right-1 text-lg animate-bounce delay-200">🍕</div>
            <div className="absolute -bottom-2 -left-2 text-xl animate-pulse delay-300">🎊</div>
          </div>
          
          {/* Main message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Woohoo! Payment Successful! 🎉
          </h2>
          
          {/* Fun message */}
          <p className="text-gray-600 mb-4">
            Your taste buds are in for a treat! We're already whipping up your delicious order 
            and it'll be racing to your door faster than you can say "food delivery"! 🚚💨
          </p>
          
          {/* Order details */}
          {orderNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="font-mono text-lg font-semibold text-primary">
                #{orderNumber}
              </p>
            </div>
          )}
          
          {/* Fun note */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-800">
              <span className="font-medium">Pro tip:</span> Why not do a little happy dance while you wait? 
              Your food will taste even better when you're in a good mood! 💃🕺
            </p>
          </div>
          
          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
          >
            See Order Details 🍽️
          </button>
          
          {/* Footer message */}
          <p className="text-xs text-gray-500 mt-4">
            Get ready for some seriously good food! 😋
          </p>
        </div>
      </div>
    </div>
  )
}