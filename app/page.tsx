import { getRestaurants, getCategories, getFeaturedMenuItems } from '@/lib/cosmic'
import RestaurantCard from '@/components/RestaurantCard'
import CategoryCard from '@/components/CategoryCard'
import MenuItemCard from '@/components/MenuItemCard'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react'

export default async function HomePage() {
  // Fetch data server-side
  const [restaurants, categories, featuredMenuItems] = await Promise.all([
    getRestaurants(),
    getCategories(),
    getFeaturedMenuItems(6),
  ])

  // Filter to only show open restaurants
  const openRestaurants = restaurants.filter(restaurant => 
    restaurant.metadata?.is_open
  ).slice(0, 6) // Limit to 6 for homepage

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Delicious food delivered
              <span className="block text-yellow-300">to your doorstep</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Order from your favorite restaurants and get fresh, hot meals delivered fast
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar 
                placeholder="Search restaurants, cuisines, or dishes..."
                className="text-gray-900"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{openRestaurants.length}+</div>
                <div className="text-white/80">Restaurants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{categories.length}+</div>
                <div className="text-white/80">Cuisines</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">30 min</div>
                <div className="text-white/80">Avg Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Browse by Category
              </h2>
              <p className="text-gray-600">
                Discover your favorite cuisines
              </p>
            </div>
            <Link
              href="/categories"
              className="flex items-center space-x-2 text-primary hover:text-primary-dark font-medium transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏷️</div>
              <p className="text-gray-600">No categories available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Dishes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Try these popular dishes from highly-rated restaurants in your area
            </p>
          </div>

          {featuredMenuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMenuItems.map((menuItem) => (
                <MenuItemCard key={menuItem.id} menuItem={menuItem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-600">No featured items available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Popular Restaurants
              </h2>
              <p className="text-gray-600">
                Top-rated restaurants near you
              </p>
            </div>
            <Link
              href="/restaurants"
              className="flex items-center space-x-2 text-primary hover:text-primary-dark font-medium transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {openRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {openRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No restaurants open right now
              </h3>
              <p className="text-gray-600">
                Check back later for available restaurants in your area.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How FoodDash Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting your favorite food delivered is easier than ever
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Choose Restaurant
              </h3>
              <p className="text-gray-600">
                Browse restaurants by cuisine, rating, or delivery time
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Select Dishes
              </h3>
              <p className="text-gray-600">
                Pick your favorite dishes and customize your order
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Get your food delivered hot and fresh to your door
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}