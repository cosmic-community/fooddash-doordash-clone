import RestaurantCard from './RestaurantCard'
import MenuItemCard from './MenuItemCard'
import type { SearchResultsProps } from '@/types'

export default function SearchResults({ query, restaurants, menuItems }: SearchResultsProps) {
  const totalResults = restaurants.length + menuItems.length

  if (totalResults === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No results found for "{query}"
        </h3>
        <p className="text-gray-600">
          Try searching for different keywords or browse our restaurants.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search Summary */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Search Results for "{query}"
        </h2>
        <p className="text-gray-600">
          Found {totalResults} result{totalResults !== 1 ? 's' : ''} 
          ({restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}, {menuItems.length} menu item{menuItems.length !== 1 ? 's' : ''})
        </p>
      </div>

      {/* Restaurants */}
      {restaurants.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Restaurants ({restaurants.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      )}

      {/* Menu Items */}
      {menuItems.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Menu Items ({menuItems.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((menuItem) => (
              <MenuItemCard key={menuItem.id} menuItem={menuItem} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}