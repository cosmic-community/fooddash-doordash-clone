import { getRestaurants, getCategories, getDeliveryZones } from '@/lib/cosmic'
import RestaurantCard from '@/components/RestaurantCard'
import RestaurantFilters from '@/components/RestaurantFilters'
import type { Restaurant, Category, DeliveryZone } from '@/types'

interface RestaurantsPageProps {
  searchParams: Promise<{
    cuisine?: string
    zone?: string
    sort?: string
  }>
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  // Await search params (Next.js 15+ requirement)
  const params = await searchParams
  const { cuisine, zone, sort = 'rating' } = params

  // Fetch data server-side
  const [allRestaurants, categoriesData, deliveryZonesData] = await Promise.all([
    getRestaurants(),
    getCategories(),
    getDeliveryZones(),
  ])

  // Filter to only show open restaurants
  let filteredRestaurants = allRestaurants.filter(r => r.metadata?.is_open)

  // Apply server-side filtering
  if (cuisine) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => {
      const cuisineKey = restaurant.metadata?.cuisine_type?.key?.toLowerCase()
      const cuisineValue = restaurant.metadata?.cuisine_type?.value?.toLowerCase()
      return cuisineKey === cuisine.toLowerCase() || 
             cuisineValue === cuisine.toLowerCase()
    })
  }

  if (zone) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => {
      const deliveryZone = restaurant.metadata?.delivery_zone
      if (typeof deliveryZone === 'string') {
        return deliveryZone === zone
      }
      if (typeof deliveryZone === 'object' && deliveryZone) {
        return deliveryZone.id === zone
      }
      return false
    })
  }

  // Apply server-side sorting
  filteredRestaurants.sort((a, b) => {
    switch (sort) {
      case 'rating':
        const ratingA = a.metadata?.rating || 0
        const ratingB = b.metadata?.rating || 0
        return ratingB - ratingA // Highest first
      
      case 'delivery_time':
        // Parse delivery time (e.g., "25-35 min" -> 25)
        const timeA = parseInt(a.metadata?.delivery_time?.split('-')[0] || '999') || 999
        const timeB = parseInt(b.metadata?.delivery_time?.split('-')[0] || '999') || 999
        return timeA - timeB // Fastest first
      
      case 'delivery_fee':
        const feeA = a.metadata?.delivery_fee || 0
        const feeB = b.metadata?.delivery_fee || 0
        return feeA - feeB // Lowest first
      
      default:
        return 0
    }
  })

  const totalOpenRestaurants = allRestaurants.filter(r => r.metadata?.is_open).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Restaurants
          </h1>
          <p className="text-gray-600">
            {filteredRestaurants.length} of {totalOpenRestaurants} restaurants available for delivery
            {(cuisine || zone) && ' matching your filters'}
          </p>
        </div>

        {/* Filters */}
        <RestaurantFilters 
          categories={categoriesData}
          deliveryZones={deliveryZonesData}
          selectedCuisine={cuisine}
          selectedZone={zone}
          selectedSort={sort}
          className="mb-8"
        />

        {/* Results */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : totalOpenRestaurants === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No restaurants available
            </h3>
            <p className="text-gray-600">
              Check back later for available restaurants in your area.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No restaurants match your filters
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}