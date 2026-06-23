import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import CustomCursor from '@/components/ui/CustomCursor'
import SmoothScroll from '@/components/ui/SmoothScroll'

export const metadata: Metadata = {
  title: 'Meet Bhavsar | Meet Editor Studio — Video Editor',
  description:
    'Premium video editing portfolio. Cinematic edits, reels, motion graphics, color grading. Based in Vadodara, Gujarat, India.',
  openGraph: {
    title: 'Meet Bhavsar | Meet Editor Studio',
    description:
      'Elite video editor crafting cinematic stories from raw footage.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      <body>
        <CustomCursor />

        <SmoothScroll>
          {children}
        </SmoothScroll>

        {/* Noupe Chatbot */}
        <Script
          src="https://www.noupe.com/embed/019ee3a2b4397b60953e96c836e999365fd0.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}