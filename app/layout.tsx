import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import SessionProvider from './SessionProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://todo-rental.al'),
  title: { default: 'TodoRental – Makinë me Qira Tiranë', template: '%s | TodoRental' },
  description: "TodoRental – kompania juaj e besueshme për makinë me qira në Tiranë. Çmime transparente, pa kosto të fshehura. +355 69 753 6334.",
  keywords: ['makinë me qira Tiranë','car rental Tirana','rent a car Albania','makina me qira','todo rental tirana'],
  authors: [{ name: 'TodoRental', url: 'https://todo-rental.al' }],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: { type: 'website', locale: 'sq_AL', alternateLocale: 'en_US', url: 'https://todo-rental.al', siteName: 'TodoRental',
    title: 'TodoRental – Makinë me Qira Tiranë', description: 'Rezervo makinën tënde sot. Flotë premium, çmime të arsyeshme.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'TodoRental – Makinë me Qira Tiranë' }] },
  twitter: { card: 'summary_large_image', title: 'TodoRental – Makinë me Qira Tiranë',
    description: 'Rezervo makinën tënde sot. Flotë premium, çmime të arsyeshme.', images: ['/og-image.jpg'] },
  alternates: { canonical: 'https://todo-rental.al' },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#C9A84C' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'CarRental', name: 'TodoRental',
          description: 'Kompania premium e makinave me qira në Tiranë, Shqipëri.',
          url: 'https://todo-rental.al', telephone: '+355697536334', email: 'todo_rental@gmail.com',
          address: { '@type': 'PostalAddress', streetAddress: 'Fresku', addressLocality: 'Tiranë', addressCountry: 'AL' },
          openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '08:00', closes: '20:00' },
          priceRange: '€€', areaServed: 'Albania',
        }) }} />
      </head>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <SessionProvider>
          <ErrorBoundary>
            <div suppressHydrationWarning>{children}</div>
          </ErrorBoundary>
        </SessionProvider>
      </body>
    </html>
  );
}
