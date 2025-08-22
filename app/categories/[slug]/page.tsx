// app/categories/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getCategories, getMenuItemsByCategory } from '@/lib/cosmic'
import MenuItemCard from '@/components/MenuItemCard'
import type { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find(c => c.slug === slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.metadata?.name || category.title} - FoodDash`,
    description: category.metadata?.description || `Browse ${category.metadata?.name || category.title} dishes`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  
  const categories = await getCategories()
  const category = categories.find(c => c.slug === slug)
  
  if (!category) {
    notFound()
  }

  const menuItems = await getMenuItemsByCategory(category.id)
  const availableItems = menuItems.filter(item => item.metadata?.available)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">
            {category.metadata?.icon || '🍽️'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category.metadata?.name || category.title}
          </h1>
          {category.metadata?.description && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {category.metadata.description}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            {availableItems.length} available dishes
          </p>
        </div>

        {/* Menu Items */}
        {availableItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableItems.map((menuItem) => (
              <MenuItemCard key={menuItem.id} menuItem={menuItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {category.metadata?.icon || '🍽️'}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No items available
            </h3>
            <p className="text-gray-600">
              Check back later for {category.metadata?.name || category.title} dishes.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}