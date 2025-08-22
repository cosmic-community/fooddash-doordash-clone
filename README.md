# FoodDash - DoorDash Clone

![App Preview](https://imgix.cosmicjs.com/e10d63f0-7f14-11f0-8dcc-651091f6a7c0-photo-1513104890138-7c749659a591-1755838807594.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A comprehensive food delivery platform inspired by DoorDash, built with Next.js and powered by Cosmic CMS. This application provides a complete restaurant discovery and food ordering experience with zone-based delivery management.

## Features

- 🏪 **Restaurant Directory** - Browse restaurants by cuisine type, rating, and location
- 🍕 **Dynamic Menu System** - View detailed menu items with images and descriptions  
- 📍 **Delivery Zone Management** - Zone-based delivery with dynamic fee calculation
- 🏷️ **Smart Categorization** - Filter by food categories and dietary preferences
- ⭐ **Restaurant Ratings** - Display ratings, delivery times, and minimum orders
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🔄 **Real-time Updates** - Live restaurant status and menu availability
- 🎨 **Modern UI** - Clean interface inspired by DoorDash's design system

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=68a7f8c277147f09fa10a33f&clone_repository=68a7fac877147f09fa10a367)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> Create a Doordash clone using Next.js

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS with custom design system
- **Content Management:** Cosmic CMS with TypeScript SDK
- **Language:** TypeScript with strict type safety
- **Font:** Inter for modern typography
- **Icons:** Lucide React for consistent iconography
- **Deployment:** Vercel-ready with environment configuration

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- Bun package manager
- Cosmic CMS account with bucket access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fooddash-doordash-clone
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Cosmic credentials to `.env.local`:
```
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Cosmic SDK Examples

### Fetching Restaurants with Delivery Zones
```typescript
const restaurants = await cosmic.objects
  .find({ type: 'restaurants' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1);
```

### Getting Menu Items by Category
```typescript
const menuItems = await cosmic.objects
  .find({ 
    type: 'menu-items',
    'metadata.category': categoryId
  })
  .depth(1);
```

### Filtering by Delivery Zone
```typescript
const zoneRestaurants = await cosmic.objects
  .find({ 
    type: 'restaurants',
    'metadata.delivery_zone': zoneId
  })
  .depth(1);
```

## Cosmic CMS Integration

This application integrates with your Cosmic bucket's content structure:

### Content Types
- **Restaurants** - Restaurant information with cuisine types and delivery details
- **Menu Items** - Food items with prices, descriptions, and dietary indicators  
- **Categories** - Food categories with icons and descriptions
- **Delivery Zones** - Service areas with zip codes and delivery fees

### Key Features
- **Connected Objects** - Menu items linked to restaurants and categories
- **File Management** - Restaurant and food images with imgix optimization
- **Select Dropdowns** - Cuisine types with consistent value management
- **Switch Fields** - Restaurant status, food availability, and dietary flags
- **Relationships** - Restaurant-to-delivery-zone connections for service areas

### Content Model Relationships
- Menu Items → Restaurants (object relationship)
- Menu Items → Categories (object relationship)  
- Restaurants → Delivery Zones (object relationship)
- Dynamic filtering and sorting based on metadata fields

## Deployment Options

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Deploy to Netlify
1. Connect repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Configure environment variables

### Environment Variables
Set these in your deployment platform:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY` 
- `COSMIC_WRITE_KEY`

The application includes comprehensive TypeScript definitions, error handling, and responsive design patterns optimized for food delivery user experiences.
<!-- README_END -->