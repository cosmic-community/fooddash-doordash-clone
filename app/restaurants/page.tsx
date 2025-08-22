'use client'

import { useState, useEffect } from 'react'
import { getRestaurants, getCategories, getDeliveryZones } from '@/lib/cosmic'
import RestaurantCard from '@/components/RestaurantCard'
import RestaurantFilters from '@/components/RestaurantFilters'
import type { Restaurant, Category, DeliveryZone } from '@/types'

export default function RestaurantsPage() {
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [restaurantsData, categoriesData, deliveryZonesData] = await Promise.all([
          getRestaurants(),
          getCategories(),
          getDeliveryZones(),
        ])

        const openRestaurants = restaurantsData.filter(r => r.metadata?.is_open)
        
        setAllRestaurants(openRestaurants)
        setFilteredRestaurants(openRestaurants)
        setCategories(categoriesData)
        setDeliveryZones(deliveryZonesData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setAllRestaurants([])
        setFilteredRestaurants([])
        setCategories([])
        setDeliveryZones([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilteredResults = (restaurants: Restaurant[]) => {
    setFilteredRestaurants(restaurants)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Restaurants
          </h1>
          <p className="text-gray-600">
            {allRestaurants.length} restaurants available for delivery
          </p>
        </div>

        {/* Filters */}
        <RestaurantFilters 
          categories={categories}
          deliveryZones={deliveryZones}
          restaurants={allRestaurants}
          onFilteredResults={handleFilteredResults}
          className="mb-8"
        />

        {/* Results */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : allRestaurants.length === 0 ? (
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