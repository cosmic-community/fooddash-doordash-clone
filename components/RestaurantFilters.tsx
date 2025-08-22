'use client'

import { useState } from 'react'
import { ChevronDown, Filter, Star, Clock, DollarSign } from 'lucide-react'
import type { Category, DeliveryZone } from '@/types'

interface RestaurantFiltersProps {
  categories: Category[]
  deliveryZones: DeliveryZone[]
  className?: string
}

export default function RestaurantFilters({ 
  categories, 
  deliveryZones, 
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
              onChange={(e) => setSelectedCuisine(e.target.value)}
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
              onChange={(e) => setSelectedZone(e.target.value)}
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
              onChange={(e) => setSortBy(e.target.value)}
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
              onClick={() => {
                setSelectedCuisine('')
                setSelectedZone('')
                setSortBy('rating')
              }}
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
              {selectedCuisine}
              <button
                onClick={() => setSelectedCuisine('')}
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
                onClick={() => setSelectedZone('')}
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