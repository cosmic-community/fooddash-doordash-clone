'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import type { SearchBarProps } from '@/types'

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search restaurants, food...", 
  className = "" 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (query.trim()) {
      console.log('SearchBar: Performing search for:', query.trim())
      
      if (onSearch) {
        onSearch(query.trim())
      } else {
        // Navigate to search page with query parameter
        const searchUrl = `/search?q=${encodeURIComponent(query.trim())}`
        console.log('SearchBar: Navigating to:', searchUrl)
        router.push(searchUrl)
      }
    }
  }

  const handleClear = () => {
    console.log('SearchBar: Clearing search query')
    setQuery('')
    if (onSearch) {
      onSearch('')
    }
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  useEffect(() => {
    console.log('SearchBar: Query changed to:', query)
  }, [query])

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'transform scale-105' : ''
      }`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>
      
      {/* Submit button for accessibility - hidden but functional */}
      <button
        type="submit"
        className="sr-only"
        aria-label="Search"
      >
        Search
      </button>
    </form>
  )
}