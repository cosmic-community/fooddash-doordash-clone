import { getCategories, getMenuItemsByCategory } from '@/lib/cosmic'
import CategoryCard from '@/components/CategoryCard'

export default async function CategoriesPage() {
  const categories = await Promise.all([
    getCategories(),
  ]).then(([categories]) => 
    Promise.all(
      categories.map(async (category) => {
        const items = await getMenuItemsByCategory(category.id)
        return { ...category, itemCount: items.length }
      })
    )
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Food Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse by your favorite food types and discover new dishes
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="relative">
                <CategoryCard category={category} />
                <div className="absolute top-4 right-4 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {category.itemCount} items
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600">
              Check back later for food categories.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}