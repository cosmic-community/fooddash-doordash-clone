import Link from 'next/link'
import { ArrowRight, Clock, Star, MapPin } from 'lucide-react'
import { getRestaurants, getCategories, getFeaturedMenuItems } from '@/lib/cosmic'
import RestaurantCard from '@/components/RestaurantCard'
import CategoryCard from '@/components/CategoryCard'
import MenuItemCard from '@/components/MenuItemCard'
import SearchBar from '@/components/SearchBar'

export default async function HomePage() {
  // Test console logs to verify dashboard console capture
  console.log('🍔 FoodDash homepage loading - Dashboard console test')
  console.info('Testing info level log for dashboard capture')
  console.warn('Testing warning level log for dashboard capture')
  console.error('Testing error level log for dashboard capture')

  const [restaurants, categories, featuredItems] = await Promise.all([
    getRestaurants(),
    getCategories(),
    getFeaturedMenuItems(6),
  ])

  const openRestaurants = restaurants.filter(r => r.metadata?.is_open)

  console.log(`📊 Loaded ${restaurants.length} restaurants, ${categories.length} categories, ${featuredItems.length} featured items`)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-secondary text-white">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Everything you crave, delivered.
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Get your favorite food delivered from local restaurants in minutes.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <SearchBar placeholder="Enter your delivery address" />
                <p className="mt-4 text-sm text-white/80">
                  Sign in for saved addresses
                </p>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">{restaurants.length}+</div>
                  <div className="text-white/80">Restaurants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">25-35</div>
                  <div className="text-white/80">Avg Delivery (min)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">4.8</div>
                  <div className="text-white/80">Customer Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <Link 
              href="/categories" 
              className="flex items-center text-primary hover:text-primary-dark font-medium"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Near You</h2>
              <p className="text-gray-600">
                {openRestaurants.length} restaurants available for delivery
              </p>
            </div>
            <Link 
              href="/restaurants" 
              className="flex items-center text-primary hover:text-primary-dark font-medium"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {openRestaurants.slice(0, 6).map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

          {openRestaurants.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No restaurants available
              </h3>
              <p className="text-gray-600">
                Try searching in a different delivery zone or check back later.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Items Section */}
      {featuredItems.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Items
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Most ordered items from top-rated restaurants in your area
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((menuItem) => (
                <MenuItemCard key={menuItem.id} menuItem={menuItem} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to order?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Browse restaurants and get your food delivered in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/restaurants"
              className="btn btn-secondary px-8 py-4 text-lg"
            >
              Find Restaurants
            </Link>
            <Link
              href="/categories"
              className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 text-lg"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}