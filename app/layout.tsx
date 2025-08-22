import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'
import Script from 'next/script'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FoodDash - Food Delivery Made Easy',
  description: 'Order from your favorite restaurants and get delivery in minutes. Fresh food, fast delivery, amazing taste.',
  keywords: ['food delivery', 'restaurants', 'online ordering', 'takeout', 'food'],
  openGraph: {
    title: 'FoodDash - Food Delivery Made Easy',
    description: 'Order from your favorite restaurants and get delivery in minutes.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          src="/dashboard-console-capture.js"
          strategy="beforeInteractive"
        />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}