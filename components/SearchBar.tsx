'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { SearchBarProps } from '@/types'

export default function SearchBar({ onSearch, placeholder = "Search...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (onSearch) {
      // Use provided onSearch callback
      onSearch(query)
    } else {
      // Default behavior: navigate to search page
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
        />
      </div>
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
      >
        Search
      </button>
    </form>
  )
}