import { getRestaurants, getCategories, getDeliveryZones } from '@/lib/cosmic'
import RestaurantCard from '@/components/RestaurantCard'
import RestaurantFilters from '@/components/RestaurantFilters'

export default async function RestaurantsPage() {
  const [restaurants, categories, deliveryZones] = await Promise.all([
    getRestaurants(),
    getCategories(),
    getDeliveryZones(),
  ])

  const openRestaurants = restaurants.filter(r => r.metadata?.is_open)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Restaurants
          </h1>
          <p className="text-gray-600">
            {openRestaurants.length} restaurants available for delivery
          </p>
        </div>

        {/* Filters */}
        <RestaurantFilters 
          categories={categories}
          deliveryZones={deliveryZones}
          className="mb-8"
        />

        {/* Results */}
        {openRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {openRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}