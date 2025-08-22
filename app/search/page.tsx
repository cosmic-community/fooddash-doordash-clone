import { searchContent } from '@/lib/cosmic'
import SearchResults from '@/components/SearchResults'
import SearchBar from '@/components/SearchBar'
import type { Metadata } from 'next'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams
  const query = params.q
  
  return {
    title: query ? `Search results for "${query}" - FoodDash` : 'Search - FoodDash',
    description: query ? `Find restaurants and food matching "${query}"` : 'Search for restaurants and food',
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''

  console.log('SearchPage: Rendering with query:', query)

  // Perform search if query exists
  const results = query ? await searchContent(query) : { restaurants: [], menuItems: [] }
  
  console.log('SearchPage: Search results:', {
    restaurants: results.restaurants.length,
    menuItems: results.menuItems.length
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {query ? `Search Results` : 'Search'}
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar 
              placeholder="Search restaurants, food, cuisines..."
              className="w-full"
            />
          </div>
          
          {query && (
            <div className="mt-4">
              <p className="text-gray-600">
                {results.restaurants.length + results.menuItems.length > 0 
                  ? `Found ${results.restaurants.length + results.menuItems.length} results for "${query}"`
                  : `No results found for "${query}"`
                }
              </p>
            </div>
          )}
        </div>

        {/* Search Results */}
        {query ? (
          <SearchResults 
            query={query}
            restaurants={results.restaurants}
            menuItems={results.menuItems}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Search for Food & Restaurants
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Find your favorite restaurants, cuisines, and dishes. 
              Start typing in the search bar above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}