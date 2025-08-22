import { createBucketClient } from '@cosmicjs/sdk'
import type { Restaurant, MenuItem, Category, DeliveryZone, CosmicResponse } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Get all restaurants with delivery zones
export async function getRestaurants(): Promise<Restaurant[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'restaurants' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return (response.objects as Restaurant[]).sort((a, b) => {
      const ratingA = a.metadata?.rating || 0;
      const ratingB = b.metadata?.rating || 0;
      return ratingB - ratingA; // Highest rating first
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch restaurants');
  }
}

// Get restaurants by cuisine type
export async function getRestaurantsByCuisine(cuisineType: string): Promise<Restaurant[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'restaurants',
        'metadata.cuisine_type.key': cuisineType
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Restaurant[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch restaurants by cuisine');
  }
}

// Get restaurants by delivery zone
export async function getRestaurantsByZone(zoneId: string): Promise<Restaurant[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'restaurants',
        'metadata.delivery_zone': zoneId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Restaurant[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch restaurants by zone');
  }
}

// Get single restaurant by slug
export async function getRestaurant(slug: string): Promise<Restaurant | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'restaurants',
      slug
    }).depth(1);
    
    const restaurant = response.object as Restaurant;
    
    if (!restaurant || !restaurant.metadata) {
      return null;
    }
    
    return restaurant;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch restaurant');
  }
}

// Get menu items for a restaurant
export async function getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'menu-items',
        'metadata.restaurant': restaurantId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return (response.objects as MenuItem[]).sort((a, b) => {
      const priceA = a.metadata?.price || 0;
      const priceB = b.metadata?.price || 0;
      return priceA - priceB; // Lowest price first
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch menu items');
  }
}

// Get menu items by category
export async function getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'menu-items',
        'metadata.category': categoryId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as MenuItem[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch menu items by category');
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return (response.objects as Category[]).sort((a, b) => 
      a.title.localeCompare(b.title)
    );
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch categories');
  }
}

// Get all delivery zones
export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'delivery-zones' })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return (response.objects as DeliveryZone[]).filter(zone => 
      zone.metadata?.is_active === true
    );
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch delivery zones');
  }
}

// Get featured menu items
export async function getFeaturedMenuItems(limit = 6): Promise<MenuItem[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'menu-items',
        'metadata.available': true
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const menuItems = response.objects as MenuItem[];
    
    // Sort by restaurant rating and return limited results
    return menuItems
      .filter(item => item.metadata?.restaurant?.metadata?.rating)
      .sort((a, b) => {
        const ratingA = a.metadata?.restaurant?.metadata?.rating || 0;
        const ratingB = b.metadata?.restaurant?.metadata?.rating || 0;
        return ratingB - ratingA;
      })
      .slice(0, limit);
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch featured menu items');
  }
}

// Search restaurants and menu items
export async function searchContent(query: string): Promise<{
  restaurants: Restaurant[];
  menuItems: MenuItem[];
}> {
  try {
    // Search restaurants
    const restaurantResponse = await cosmic.objects
      .find({ type: 'restaurants' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const allRestaurants = restaurantResponse.objects as Restaurant[];
    const restaurants = allRestaurants.filter(restaurant => 
      restaurant.title.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.metadata?.name?.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.metadata?.description?.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.metadata?.cuisine_type?.value?.toLowerCase().includes(query.toLowerCase())
    );

    // Search menu items
    const menuItemResponse = await cosmic.objects
      .find({ type: 'menu-items' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const allMenuItems = menuItemResponse.objects as MenuItem[];
    const menuItems = allMenuItems.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.metadata?.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.metadata?.description?.toLowerCase().includes(query.toLowerCase())
    );

    return { restaurants, menuItems };
  } catch (error) {
    return { restaurants: [], menuItems: [] };
  }
}