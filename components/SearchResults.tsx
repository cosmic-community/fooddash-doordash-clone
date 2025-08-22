import { searchContent } from '@/lib/cosmic'
import RestaurantCard from '@/components/RestaurantCard'
import MenuItemCard from '@/components/MenuItemCard'

interface SearchResultsProps {
  query: string
}

export default async function SearchResults({ query }: SearchResultsProps) {
  const { restaurants, menuItems } = await searchContent(query)
  
  const totalResults = restaurants.length + menuItems.length

  return (
    <>
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          Found {totalResults} result{totalResults !== 1 ? 's' : ''}
        </p>
      </div>

      {totalResults === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-600">
            Try searching for something else or browse our categories
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Restaurants */}
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

          {/* Menu Items */}
          {menuItems.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dishes ({menuItems.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map((menuItem) => (
                  <MenuItemCard key={menuItem.id} menuItem={menuItem} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  )
}