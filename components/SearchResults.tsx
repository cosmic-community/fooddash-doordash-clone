import RestaurantCard from './RestaurantCard'
import MenuItemCard from './MenuItemCard'
import type { SearchResultsProps } from '@/types'

export default function SearchResults({ query, restaurants, menuItems }: SearchResultsProps) {
  const hasResults = restaurants.length > 0 || menuItems.length > 0

  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No results found for "{query}"
        </h3>
        <p className="text-gray-600">
          Try searching with different keywords or browse our categories.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Restaurants Section */}
      {restaurants.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Restaurants ({restaurants.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}

      {/* Menu Items Section */}
      {menuItems.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Menu Items ({menuItems.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((menuItem) => (
              <MenuItemCard key={menuItem.id} menuItem={menuItem} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}