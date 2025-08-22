'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, ShoppingCart, Search, User, MapPin } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import SearchBar from './SearchBar'
import CartSidebar from './CartSidebar'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { getItemCount } = useCart()
  const router = useRouter()

  const itemCount = getItemCount()

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Restaurants', href: '/restaurants' },
    { name: 'Categories', href: '/categories' },
  ]

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">FoodDash</span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search restaurants or dishes..."
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Location Selector (Placeholder) */}
              <button className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Downtown</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
                <span className="text-gray-700 font-medium">Cart</span>
              </button>

              {/* User Menu (Placeholder) */}
              <button className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
                <User className="w-5 h-5" />
                <span className="font-medium">Sign In</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Search */}
              <Link
                href="/search"
                className="p-2 text-gray-700 hover:text-primary transition-colors"
              >
                <Search className="w-6 h-6" />
              </Link>

              {/* Mobile Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-primary transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-primary transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="py-4 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-gray-700 hover:text-primary font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span>Change Location</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  )
}