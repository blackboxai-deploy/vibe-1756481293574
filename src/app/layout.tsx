import './globals.css';

export const metadata = {
  title: 'Link Shortener - URL Shortening Service',
  description: 'Shorten your URLs and track clicks with detailed analytics including geographic visualization on an interactive world map.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="font-sans bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}