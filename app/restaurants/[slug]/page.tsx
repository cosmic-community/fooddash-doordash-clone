// app/restaurants/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Star, Clock, DollarSign, MapPin, Phone } from 'lucide-react'
import { getRestaurant, getMenuItemsByRestaurant } from '@/lib/cosmic'
import MenuItemCard from '@/components/MenuItemCard'
import type { Metadata } from 'next'

interface RestaurantPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: RestaurantPageProps): Promise<Metadata> {
  const { slug } = await params
  const restaurant = await getRestaurant(slug)
  
  if (!restaurant) {
    return {
      title: 'Restaurant Not Found',
    }
  }

  return {
    title: `${restaurant.metadata?.name || restaurant.title} - FoodDash`,
    description: restaurant.metadata?.description || 'Order food delivery',
  }
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params
  
  const [restaurant, menuItems] = await Promise.all([
    getRestaurant(slug),
    getRestaurant(slug).then(restaurant => 
      restaurant ? getMenuItemsByRestaurant(restaurant.id) : []
    ),
  ])

  if (!restaurant) {
    notFound()
  }

  const { metadata } = restaurant
  const rating = metadata?.rating || 0
  const deliveryFee = metadata?.delivery_fee || 0
  const deliveryTime = metadata?.delivery_time || 'N/A'
  const minOrder = metadata?.minimum_order || 0
  const isOpen = metadata?.is_open
  const restaurantImage = metadata?.restaurant_image
  const deliveryZone = metadata?.delivery_zone

  // Group menu items by category
  const itemsByCategory = menuItems.reduce((acc, item) => {
    const category = item.metadata?.category
    if (!category) return acc
    
    const categoryName = category.metadata?.name || category.title
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(item)
    return acc
  }, {} as Record<string, typeof menuItems>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white">
        <div className="relative h-64 md:h-80">
          {restaurantImage?.imgix_url ? (
            <img
              src={`${restaurantImage.imgix_url}?w=1200&h=400&fit=crop&auto=format,compress`}
              alt={metadata?.name || restaurant.title}
              width={600}
              height={300}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🏪</div>
                <div className="text-xl font-semibold">{metadata?.cuisine_type?.value}</div>
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Restaurant Info */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {metadata?.name || restaurant.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                {rating > 0 && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                  </div>
                )}
                <span className="text-gray-500">•</span>
                <span className="text-gray-700 font-medium">
                  {metadata?.cuisine_type?.value}
                </span>
              </div>

              <p className="text-gray-600 mb-6 text-lg">
                {metadata?.description}
              </p>

              {/* Restaurant Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{deliveryTime} delivery</span>
                  </div>
                  {deliveryFee > 0 ? (
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-5 w-5 mr-3 text-gray-400" />
                      <span>${deliveryFee.toFixed(2)} delivery fee</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <DollarSign className="h-5 w-5 mr-3 text-green-400" />
                      <span>Free delivery</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {metadata?.address && (
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                      <span>{metadata.address}</span>
                    </div>
                  )}
                  {metadata?.phone && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <span>{metadata.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-100 rounded-xl p-6 sticky top-8">
                <h3 className="font-semibold text-lg mb-4">Order Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum order</span>
                    <span className="font-medium">${minOrder.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery fee</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery time</span>
                    <span className="font-medium">{deliveryTime}</span>
                  </div>
                  {deliveryZone && typeof deliveryZone === 'object' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery zone</span>
                      <span className="font-medium">{deliveryZone.metadata?.zone_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Menu</h2>
        
        {Object.keys(itemsByCategory).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(itemsByCategory).map(([categoryName, items]) => (
              <div key={categoryName}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {categoryName} ({items.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((menuItem) => (
                    <MenuItemCard key={menuItem.id} menuItem={menuItem} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No menu items available
            </h3>
            <p className="text-gray-600">
              Check back later for the latest menu.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}