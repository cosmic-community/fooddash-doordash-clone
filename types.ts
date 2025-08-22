// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Cuisine type for select-dropdown
type CuisineType = 'American' | 'Italian' | 'Mexican' | 'Asian' | 'Indian' | 'Mediterranean';

// Delivery Zone interface
interface DeliveryZone extends CosmicObject {
  type: 'delivery-zones';
  metadata: {
    zone_name: string;
    zip_codes: string;
    base_delivery_fee: number;
    is_active: boolean;
  };
}

// Category interface
interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    name: string;
    description?: string;
    icon?: string;
  };
}

// Restaurant interface
interface Restaurant extends CosmicObject {
  type: 'restaurants';
  metadata: {
    name: string;
    description: string;
    address: string;
    phone?: string;
    cuisine_type: {
      key: string;
      value: CuisineType;
    };
    rating?: number;
    delivery_fee: number;
    minimum_order: number;
    delivery_time?: string;
    restaurant_image?: {
      url: string;
      imgix_url: string;
    };
    is_open: boolean;
    delivery_zone?: DeliveryZone | string;
  };
}

// Menu Item interface
interface MenuItem extends CosmicObject {
  type: 'menu-items';
  metadata: {
    name: string;
    description: string;
    price: number;
    restaurant: Restaurant;
    category: Category;
    food_image?: {
      url: string;
      imgix_url: string;
    };
    is_vegetarian: boolean;
    is_spicy: boolean;
    available: boolean;
  };
}

// Cart item interface
interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

// Cart totals interface
interface CartTotals {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

// Cart context interface
interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotals: () => CartTotals;
  getRestaurantInfo: () => { restaurant: Restaurant | null; hasMultipleRestaurants: boolean };
}

// API response types
interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Component prop types
interface RestaurantCardProps {
  restaurant: Restaurant;
  className?: string;
}

interface MenuItemCardProps {
  menuItem: MenuItem;
  className?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onCategoryChange: (categoryId?: string) => void;
  className?: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

interface SearchResultsProps {
  query: string;
  restaurants: Restaurant[];
  menuItems: MenuItem[];
}

interface CartItemProps {
  item: CartItem;
  className?: string;
}

interface AddToCartButtonProps {
  menuItem: MenuItem;
  className?: string;
  variant?: 'default' | 'compact';
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Type guards
function isRestaurant(obj: CosmicObject): obj is Restaurant {
  return obj.type === 'restaurants';
}

function isMenuItem(obj: CosmicObject): obj is MenuItem {
  return obj.type === 'menu-items';
}

function isCategory(obj: CosmicObject): obj is Category {
  return obj.type === 'categories';
}

function isDeliveryZone(obj: CosmicObject): obj is DeliveryZone {
  return obj.type === 'delivery-zones';
}

// Utility types
type CreateRestaurantData = Omit<Restaurant, 'id' | 'created_at' | 'modified_at'>;
type CreateMenuItemData = Omit<MenuItem, 'id' | 'created_at' | 'modified_at'>;

export type {
  CosmicObject,
  Restaurant,
  MenuItem,
  Category,
  DeliveryZone,
  CartItem,
  CartTotals,
  CartContextType,
  CosmicResponse,
  RestaurantCardProps,
  MenuItemCardProps,
  CategoryFilterProps,
  SearchBarProps,
  SearchResultsProps,
  CartItemProps,
  AddToCartButtonProps,
  CartSidebarProps,
  CreateRestaurantData,
  CreateMenuItemData,
  CuisineType,
};

export {
  isRestaurant,
  isMenuItem,
  isCategory,
  isDeliveryZone,
};