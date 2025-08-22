import { Star, Leaf, Flame } from 'lucide-react'
import type { MenuItemCardProps } from '@/types'

export default function MenuItemCard({ menuItem, className = '' }: MenuItemCardProps) {
  if (!menuItem || !menuItem.metadata) {
    return null
  }

  const { metadata } = menuItem
  const price = metadata.price || 0
  const isVegetarian = metadata.is_vegetarian
  const isSpicy = metadata.is_spicy
  const isAvailable = metadata.available
  const foodImage = metadata.food_image
  const restaurant = metadata.restaurant
  const category = metadata.category

  return (
    <div className={`menu-item-card ${className} ${!isAvailable ? 'opacity-60' : ''}`}>
      <div className="flex space-x-4">
        {/* Menu Item Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {foodImage?.imgix_url ? (
            <img
              src={`${foodImage.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
              alt={metadata.name || menuItem.title}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-2xl">
                {category?.metadata?.icon || '🍽️'}
              </span>
            </div>
          )}
          
          {/* Availability Badge */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Unavailable</span>
            </div>
          )}
        </div>

        {/* Menu Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium text-gray-900 line-clamp-1">
              {metadata.name || menuItem.title}
            </h4>
            <div className="text-lg font-semibold text-gray-900 ml-2">
              ${price.toFixed(2)}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {metadata.description}
          </p>

          {/* Restaurant Name */}
          {restaurant && (
            <div className="text-sm text-gray-500 mb-2">
              from {restaurant.metadata?.name || restaurant.title}
            </div>
          )}

          {/* Tags and Category */}
          <div className="flex items-center space-x-2">
            {category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {category.metadata?.icon && (
                  <span className="mr-1">{category.metadata.icon}</span>
                )}
                {category.metadata?.name || category.title}
              </span>
            )}
            
            {isVegetarian && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Leaf className="w-3 h-3 mr-1" />
                Vegetarian
              </span>
            )}
            
            {isSpicy && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <Flame className="w-3 h-3 mr-1" />
                Spicy
              </span>
            )}
          </div>

          {/* Restaurant Rating */}
          {restaurant?.metadata?.rating && (
            <div className="flex items-center mt-2">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600 ml-1">
                {restaurant.metadata.rating.toFixed(1)} • {restaurant.metadata?.delivery_time || 'N/A'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            isAvailable
              ? 'bg-primary hover:bg-primary-dark text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!isAvailable}
        >
          {isAvailable ? 'Add to Cart' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  )
}