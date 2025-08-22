import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
  className?: string
}

export default function CategoryCard({ category, className = '' }: CategoryCardProps) {
  if (!category || !category.metadata) {
    return null
  }

  const { metadata } = category
  const icon = metadata.icon || '🍽️'
  const name = metadata.name || category.title

  return (
    <Link href={`/categories/${category.slug}`}>
      <div className={`card p-6 text-center hover:shadow-elevated transition-all duration-200 cursor-pointer ${className}`}>
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="font-medium text-gray-900 mb-1">{name}</h3>
        {metadata.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {metadata.description}
          </p>
        )}
      </div>
    </Link>
  )
}