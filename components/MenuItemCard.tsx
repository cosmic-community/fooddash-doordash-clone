import Link from 'next/link'
import { Leaf, Flame } from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'
import type { MenuItemCardProps } from '@/types'

export default function MenuItemCard({ menuItem, className = '' }: MenuItemCardProps) {
  if (!menuItem || !menuItem.metadata) {
    return null
  }

  const { metadata } = menuItem
  const restaurant = metadata.restaurant
  const category = metadata.category
  const foodImage = metadata.food_image
  const price = metadata.price || 0
  const isVegetarian = metadata.is_vegetarian
  const isSpicy = metadata.is_spicy
  const isAvailable = metadata.available

  return (
    <div className={`menu-item-card bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow ${className}`}>
      {/* Food Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {foodImage?.imgix_url ? (
          <img
            src={`${foodImage.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
            alt={metadata.name || menuItem.title}
            width={300}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🍽️</div>
              <div className="text-sm">{category?.metadata?.name}</div>
            </div>
          </div>
        )}

        {/* Availability Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-medium">
              Unavailable
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {isVegetarian && (
            <div className="bg-green-100 text-green-800 p-1.5 rounded-full" title="Vegetarian">
              <Leaf className="w-4 h-4" />
            </div>
          )}
          {isSpicy && (
            <div className="bg-red-100 text-red-800 p-1.5 rounded-full" title="Spicy">
              <Flame className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Item Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {metadata.name || menuItem.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {metadata.description}
          </p>

          {/* Restaurant Link */}
          {restaurant && (
            <Link 
              href={`/restaurants/${restaurant.slug}`}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              {restaurant.metadata?.name || restaurant.title}
            </Link>
          )}
        </div>

        {/* Add to Cart Section */}
        <AddToCartButton 
          menuItem={menuItem}
          variant="compact"
          className="mt-4"
        />
      </div>
    </div>
  )
}