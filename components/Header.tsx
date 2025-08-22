'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import CartSidebar from '@/components/CartSidebar'
import SearchBar from '@/components/SearchBar'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Restaurants', href: '/restaurants' },
    { name: 'Categories', href: '/categories' },
  ]

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="font-bold text-xl text-gray-900">FoodDash</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Search */}
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <SearchBar placeholder="Search restaurants or dishes..." />
            </div>

            {/* Cart and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-primary transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <SearchBar placeholder="Search restaurants or dishes..." />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}