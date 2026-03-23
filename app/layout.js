import './globals.css'

export const metadata = {
  title: 'LAST THE PUFF | A Story They Never Wanted You To See',
  description: 'A cinematic experience about addiction, love, and consequence. Hyderabad Premiere - Limited Access.',
  keywords: 'Last The Puff, short film, Hyderabad, premiere, cinema, addiction, drama',
  openGraph: {
    title: 'LAST THE PUFF | A Story They Never Wanted You To See',
    description: 'A cinematic experience about addiction, love, and consequence.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
