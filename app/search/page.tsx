import { searchContent } from '@/lib/cosmic'
import SearchBar from '@/components/SearchBar'
import SearchResults from '@/components/SearchResults'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Await search params (Next.js 15+ requirement)
  const params = await searchParams
  const query = params.q || ''

  // Perform search if query exists
  const searchResults = query.length > 2 
    ? await searchContent(query)
    : { restaurants: [], menuItems: [] }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Search Restaurants & Food
          </h1>
          <SearchBar 
            placeholder="Search restaurants, cuisines, or dishes..." 
            className="shadow-lg"
          />
        </div>

        {/* Search Results or Instructions */}
        {query ? (
          query.length > 2 ? (
            <SearchResults 
              query={query} 
              restaurants={searchResults.restaurants}
              menuItems={searchResults.menuItems}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Search term too short
              </h3>
              <p className="text-gray-600">
                Please enter at least 3 characters to search.
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🍕🍔🥗</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What are you craving today?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Search for your favorite restaurants, cuisines, or specific dishes. 
              We'll help you find exactly what you're looking for.
            </p>

            {/* Popular Search Suggestions */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Popular Searches
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  'Pizza', 'Burgers', 'Asian', 'Italian', 'Mexican', 
                  'Vegetarian', 'Spicy', 'Fast Food'
                ].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}