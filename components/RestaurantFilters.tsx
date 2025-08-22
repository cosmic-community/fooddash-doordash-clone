'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { ChevronDown, Filter, Star, Clock, DollarSign } from 'lucide-react'
import type { Category, DeliveryZone } from '@/types'

interface RestaurantFiltersProps {
  categories: Category[]
  deliveryZones: DeliveryZone[]
  selectedCuisine?: string
  selectedZone?: string
  selectedSort?: string
  className?: string
}

export default function RestaurantFilters({ 
  categories, 
  deliveryZones, 
  selectedCuisine = '',
  selectedZone = '',
  selectedSort = 'rating',
  className = '' 
}: RestaurantFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const cuisineTypes = [
    'American', 'Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean'
  ]

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated', icon: Star },
    { value: 'delivery_time', label: 'Fastest Delivery', icon: Clock },
    { value: 'delivery_fee', label: 'Lowest Delivery Fee', icon: DollarSign },
  ]

  const updateFilters = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove parameters
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    // Navigate to new URL with updated search parameters
    router.push(`/restaurants?${params.toString()}`)
  }, [router, searchParams])

  const handleCuisineChange = (value: string) => {
    updateFilters({ cuisine: value })
  }

  const handleZoneChange = (value: string) => {
    updateFilters({ zone: value })
  }

  const handleSortChange = (value: string) => {
    updateFilters({ sort: value })
  }

  const clearAllFilters = () => {
    router.push('/restaurants')
  }

  return (
    <div className={`bg-white rounded-xl shadow-card p-6 ${className}`}>
      {/* Filters */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Cuisine Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Type
            </label>
            <select
              value={selectedCuisine}
              onChange={(e) => handleCuisineChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Cuisines</option>
              {cuisineTypes.map((cuisine) => (
                <option key={cuisine} value={cuisine.toLowerCase()}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Zone Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Zone
            </label>
            <select
              value={selectedZone}
              onChange={(e) => handleZoneChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Zones</option>
              {deliveryZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.metadata?.zone_name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearAllFilters}
              className="w-full p-2 text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {selectedCuisine && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
              {cuisineTypes.find(c => c.toLowerCase() === selectedCuisine.toLowerCase()) || selectedCuisine}
              <button
                onClick={() => handleCuisineChange('')}
                className="ml-2 text-primary hover:text-primary-dark"
              >
                ×
              </button>
            </span>
          )}
          {selectedZone && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
              {deliveryZones.find(z => z.id === selectedZone)?.metadata?.zone_name}
              <button
                onClick={() => handleZoneChange('')}
                className="ml-2 text-primary hover:text-primary-dark"
              >
                ×
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}