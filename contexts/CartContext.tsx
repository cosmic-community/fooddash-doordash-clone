'use client'

import React, { createContext, useContext, useEffect, useReducer } from 'react'
import type { CartItem, CartContextType, CartTotals, MenuItem, Restaurant } from '@/types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; quantity: number; specialInstructions?: string } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { items: CartItem[] } }

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, quantity, specialInstructions } = action.payload
      
      // Ensure we have a valid menuItem with an id
      if (!menuItem?.id) {
        console.error('Cannot add item without valid menuItem id')
        return state
      }
      
      const existingItemIndex = state.items.findIndex(
        item => item.menuItem.id === menuItem.id && item.specialInstructions === specialInstructions
      )

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...state.items]
        const existingItem = updatedItems[existingItemIndex]
        if (existingItem) {
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + quantity
          }
        }
        return { ...state, items: updatedItems }
      } else {
        // Add new item - ensure id is always a string
        const newItem: CartItem = {
          id: `${menuItem.id}-${Date.now()}-${Math.random()}`,
          menuItem,
          quantity,
          specialInstructions
        }
        return { ...state, items: [...state.items, newItem] }
      }
    }

    case 'REMOVE_ITEM': {
      const { itemId } = action.payload
      return {
        ...state,
        items: state.items.filter(item => item.id !== itemId)
      }
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== itemId)
        }
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'LOAD_CART':
      return { ...state, items: action.payload.items }

    default:
      return state
  }
}

interface CartProviderProps {
  children: React.ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('fooddash-cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: { items: parsedCart } })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('fooddash-cart', JSON.stringify(state.items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [state.items])

  const addItem = (menuItem: MenuItem, quantity = 1, specialInstructions?: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { menuItem, quantity, specialInstructions } })
  }

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  const getTotals = (): CartTotals => {
    const subtotal = state.items.reduce(
      (total, item) => total + (item.menuItem.metadata?.price || 0) * item.quantity,
      0
    )

    // Get delivery fee from the restaurant (assuming single restaurant orders)
    const restaurant = getRestaurantInfo().restaurant
    const deliveryFee = restaurant?.metadata?.delivery_fee || 0

    // Calculate tax (8.25% for example)
    const taxRate = 0.0825
    const tax = subtotal * taxRate

    const total = subtotal + deliveryFee + tax

    return {
      subtotal,
      deliveryFee,
      tax,
      total
    }
  }

  const getRestaurantInfo = () => {
    if (state.items.length === 0) {
      return { restaurant: null, hasMultipleRestaurants: false }
    }

    const restaurants = new Map<string, Restaurant>()
    
    state.items.forEach(item => {
      const restaurant = item.menuItem.metadata?.restaurant
      if (restaurant && restaurant.id) {
        restaurants.set(restaurant.id, restaurant)
      }
    })

    const uniqueRestaurants = Array.from(restaurants.values())
    
    return {
      restaurant: uniqueRestaurants[0] || null,
      hasMultipleRestaurants: uniqueRestaurants.length > 1
    }
  }

  const contextValue: CartContextType = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotals,
    getRestaurantInfo
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}