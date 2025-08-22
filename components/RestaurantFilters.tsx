'use client'

import { useState, useCallback } from 'react'
import { ChevronDown, Filter, Star, Clock, DollarSign } from 'lucide-react'
import type { Category, DeliveryZone, Restaurant } from '@/types'

interface RestaurantFiltersProps {
  categories: Category[]
  deliveryZones: DeliveryZone[]
  restaurants: Restaurant[]
  onFilteredResults: (restaurants: Restaurant[]) => void
  className?: string
}

export default function RestaurantFilters({ 
  categories, 
  deliveryZones, 
  restaurants,
  onFilteredResults,
  className = '' 
}: RestaurantFiltersProps) {
  const [selectedCuisine, setSelectedCuisine] = useState('')
  const [selectedZone, setSelectedZone] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('rating')

  const cuisineTypes = [
    'American', 'Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean'
  ]

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated', icon: Star },
    { value: 'delivery_time', label: 'Fastest Delivery', icon: Clock },
    { value: 'delivery_fee', label: 'Lowest Delivery Fee', icon: DollarSign },
  ]

  const applyFilters = useCallback(() => {
    let filtered = [...restaurants]

    // Filter by cuisine type
    if (selectedCuisine) {
      filtered = filtered.filter(restaurant => {
        const cuisineKey = restaurant.metadata?.cuisine_type?.key?.toLowerCase()
        const cuisineValue = restaurant.metadata?.cuisine_type?.value?.toLowerCase()
        return cuisineKey === selectedCuisine.toLowerCase() || 
               cuisineValue === selectedCuisine.toLowerCase()
      })
    }

    // Filter by delivery zone
    if (selectedZone) {
      filtered = filtered.filter(restaurant => {
        const deliveryZone = restaurant.metadata?.delivery_zone
        if (typeof deliveryZone === 'string') {
          return deliveryZone === selectedZone
        }
        if (typeof deliveryZone === 'object' && deliveryZone) {
          return deliveryZone.id === selectedZone
        }
        return false
      })
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
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

    onFilteredResults(filtered)
  }, [selectedCuisine, selectedZone, sortBy, restaurants, onFilteredResults])

  // Apply filters whenever filter values change
  const handleCuisineChange = (value: string) => {
    setSelectedCuisine(value)
    // Apply filters after state update
    setTimeout(() => {
      let filtered = [...restaurants]

      // Filter by cuisine type
      if (value) {
        filtered = filtered.filter(restaurant => {
          const cuisineKey = restaurant.metadata?.cuisine_type?.key?.toLowerCase()
          const cuisineValue = restaurant.metadata?.cuisine_type?.value?.toLowerCase()
          return cuisineKey === value.toLowerCase() || 
                 cuisineValue === value.toLowerCase()
        })
      }

      // Filter by delivery zone
      if (selectedZone) {
        filtered = filtered.filter(restaurant => {
          const deliveryZone = restaurant.metadata?.delivery_zone
          if (typeof deliveryZone === 'string') {
            return deliveryZone === selectedZone
          }
          if (typeof deliveryZone === 'object' && deliveryZone) {
            return deliveryZone.id === selectedZone
          }
          return false
        })
      }

      // Sort results
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            const ratingA = a.metadata?.rating || 0
            const ratingB = b.metadata?.rating || 0
            return ratingB - ratingA
          case 'delivery_time':
            const timeA = parseInt(a.metadata?.delivery_time?.split('-')[0] || '999') || 999
            const timeB = parseInt(b.metadata?.delivery_time?.split('-')[0] || '999') || 999
            return timeA - timeB
          case 'delivery_fee':
            const feeA = a.metadata?.delivery_fee || 0
            const feeB = b.metadata?.delivery_fee || 0
            return feeA - feeB
          default:
            return 0
        }
      })

      onFilteredResults(filtered)
    }, 0)
  }

  const handleZoneChange = (value: string) => {
    setSelectedZone(value)
    // Apply filters after state update
    setTimeout(() => {
      let filtered = [...restaurants]

      // Filter by cuisine type
      if (selectedCuisine) {
        filtered = filtered.filter(restaurant => {
          const cuisineKey = restaurant.metadata?.cuisine_type?.key?.toLowerCase()
          const cuisineValue = restaurant.metadata?.cuisine_type?.value?.toLowerCase()
          return cuisineKey === selectedCuisine.toLowerCase() || 
                 cuisineValue === selectedCuisine.toLowerCase()
        })
      }

      // Filter by delivery zone
      if (value) {
        filtered = filtered.filter(restaurant => {
          const deliveryZone = restaurant.metadata?.delivery_zone
          if (typeof deliveryZone === 'string') {
            return deliveryZone === value
          }
          if (typeof deliveryZone === 'object' && deliveryZone) {
            return deliveryZone.id === value
          }
          return false
        })
      }

      // Sort results
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            const ratingA = a.metadata?.rating || 0
            const ratingB = b.metadata?.rating || 0
            return ratingB - ratingA
          case 'delivery_time':
            const timeA = parseInt(a.metadata?.delivery_time?.split('-')[0] || '999') || 999
            const timeB = parseInt(b.metadata?.delivery_time?.split('-')[0] || '999') || 999
            return timeA - timeB
          case 'delivery_fee':
            const feeA = a.metadata?.delivery_fee || 0
            const feeB = b.metadata?.delivery_fee || 0
            return feeA - feeB
          default:
            return 0
        }
      })

      onFilteredResults(filtered)
    }, 0)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    // Apply filters after state update
    setTimeout(() => {
      let filtered = [...restaurants]

      // Filter by cuisine type
      if (selectedCuisine) {
        filtered = filtered.filter(restaurant => {
          const cuisineKey = restaurant.metadata?.cuisine_type?.key?.toLowerCase()
          const cuisineValue = restaurant.metadata?.cuisine_type?.value?.toLowerCase()
          return cuisineKey === selectedCuisine.toLowerCase() || 
                 cuisineValue === selectedCuisine.toLowerCase()
        })
      }

      // Filter by delivery zone
      if (selectedZone) {
        filtered = filtered.filter(restaurant => {
          const deliveryZone = restaurant.metadata?.delivery_zone
          if (typeof deliveryZone === 'string') {
            return deliveryZone === selectedZone
          }
          if (typeof deliveryZone === 'object' && deliveryZone) {
            return deliveryZone.id === selectedZone
          }
          return false
        })
      }

      // Sort results
      filtered.sort((a, b) => {
        switch (value) {
          case 'rating':
            const ratingA = a.metadata?.rating || 0
            const ratingB = b.metadata?.rating || 0
            return ratingB - ratingA
          case 'delivery_time':
            const timeA = parseInt(a.metadata?.delivery_time?.split('-')[0] || '999') || 999
            const timeB = parseInt(b.metadata?.delivery_time?.split('-')[0] || '999') || 999
            return timeA - timeB
          case 'delivery_fee':
            const feeA = a.metadata?.delivery_fee || 0
            const feeB = b.metadata?.delivery_fee || 0
            return feeA - feeB
          default:
            return 0
        }
      })

      onFilteredResults(filtered)
    }, 0)
  }

  const clearAllFilters = () => {
    setSelectedCuisine('')
    setSelectedZone('')
    setSortBy('rating')
    onFilteredResults(restaurants)
  }

  return (
    <div className={`bg-white rounded-xl shadow-card p-6 ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg"
        >
          <span className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters & Sort
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
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
              value={sortBy}
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

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {restaurants.length > 0 && (
            <span>
              Showing {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
              {(selectedCuisine || selectedZone) && ' matching your filters'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}