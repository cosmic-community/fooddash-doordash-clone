import { Suspense } from 'react'
import { searchContent } from '@/lib/cosmic'
import SearchBar from '@/components/SearchBar'
import SearchResults from '@/components/SearchResults'
import type { Metadata } from 'next'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  
  if (!q) {
    return {
      title: 'Search - FoodDash',
      description: 'Search for restaurants and menu items',
    }
  }

  return {
    title: `Search results for "${q}" - FoodDash`,
    description: `Find restaurants and menu items matching "${q}"`,
  }
}

async function SearchPageContent({ query }: { query: string }) {
  const { restaurants, menuItems } = await searchContent(query)

  return (
    <SearchResults 
      query={query}
      restaurants={restaurants}
      menuItems={menuItems}
    />
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {query ? `Search Results` : 'Search'}
          </h1>
          <div className="max-w-2xl">
            <SearchBar 
              placeholder="Search restaurants, dishes, or cuisine..." 
              className="w-full" 
            />
          </div>
          {query && (
            <p className="mt-4 text-gray-600">
              Showing results for "<span className="font-medium text-gray-900">{query}</span>"
            </p>
          )}
        </div>

        {/* Search Results */}
        {query ? (
          <Suspense 
            fallback={
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Searching...</p>
              </div>
            }
          >
            <SearchPageContent query={query} />
          </Suspense>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Start your search
            </h2>
            <p className="text-gray-600">
              Enter a restaurant name, dish, or cuisine type to find what you're craving.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}