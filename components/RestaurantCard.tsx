import Link from 'next/link'
import { Star, Clock, DollarSign, MapPin } from 'lucide-react'
import type { RestaurantCardProps } from '@/types'

export default function RestaurantCard({ restaurant, className = '' }: RestaurantCardProps) {
  if (!restaurant || !restaurant.metadata) {
    return null
  }

  const { metadata } = restaurant
  const rating = metadata.rating || 0
  const deliveryFee = metadata.delivery_fee || 0
  const deliveryTime = metadata.delivery_time || 'N/A'
  const cuisineType = metadata.cuisine_type?.value || 'Restaurant'
  const minOrder = metadata.minimum_order || 0
  const isOpen = metadata.is_open
  const restaurantImage = metadata.restaurant_image
  const deliveryZone = metadata.delivery_zone

  return (
    <Link href={`/restaurants/${restaurant.slug}`}>
      <div className={`restaurant-card ${className}`}>
        {/* Restaurant Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {restaurantImage?.imgix_url ? (
            <img
              src={`${restaurantImage.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
              alt={metadata.name || restaurant.title}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">🏪</div>
                <div className="text-sm">{cuisineType}</div>
              </div>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>

          {/* Delivery Fee Badge */}
          {deliveryFee === 0 && (
            <div className="absolute top-3 right-3">
              <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                Free Delivery
              </span>
            </div>
          )}
        </div>

        {/* Restaurant Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {metadata.name || restaurant.title}
            </h3>
            {rating > 0 && (
              <div className="flex items-center space-x-1 ml-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {metadata.description}
          </p>

          <div className="space-y-2">
            {/* Cuisine Type */}
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium text-gray-700">{cuisineType}</span>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{deliveryTime}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${deliveryFee.toFixed(2)} delivery</span>
                  </div>
                )}
              </div>
            </div>

            {/* Min Order */}
            {minOrder > 0 && (
              <div className="text-sm text-gray-500">
                Min. order ${minOrder.toFixed(2)}
              </div>
            )}

            {/* Delivery Zone */}
            {deliveryZone && typeof deliveryZone === 'object' && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{deliveryZone.metadata?.zone_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}