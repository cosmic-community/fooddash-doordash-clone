import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FoodDash - Food Delivery Made Easy',
  description: 'Order your favorite food from local restaurants. Fast delivery, great prices, and delicious meals delivered to your door.',
  keywords: 'food delivery, restaurants, takeout, order online, fast food',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get bucket slug for the Cosmic badge from environment variable
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <CosmicBadge bucketSlug={bucketSlug} />
        </CartProvider>
      </body>
    </html>
  )
}