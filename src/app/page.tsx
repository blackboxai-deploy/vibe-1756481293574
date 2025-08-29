'use client';

import { useState } from 'react';
import { LinkShortener } from '@/components/link-shortener';
import { RecentLinks } from '@/components/recent-links';

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLinkCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Link Shortener
            </h1>
            <p className="text-gray-300 text-lg">
              Shorten your URLs and track clicks with detailed analytics
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Link Shortener Section */}
          <div className="flex justify-center">
            <LinkShortener onLinkCreated={handleLinkCreated} />
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast & Reliable</h3>
              <p className="text-gray-300">
                Generate short links instantly with high availability and fast redirects worldwide.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-white mb-2">Detailed Analytics</h3>
              <p className="text-gray-300">
                Track every click with geographic data, device information, and referrer details.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Geographic Insights</h3>
              <p className="text-gray-300">
                Visualize your audience on an interactive world map with country-wise statistics.
              </p>
            </div>
          </div>

          {/* Recent Links */}
          <RecentLinks refreshTrigger={refreshTrigger} />

          {/* Demo Data Notice */}
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 text-center">
            <p className="text-blue-200 text-sm">
              <strong>Demo Mode:</strong> This application uses in-memory storage. 
              Data will be lost when the server restarts. 
              Perfect for testing and demonstration purposes!
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-300 text-sm">
            Built with Next.js, Tailwind CSS, and shadcn/ui components
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Features: URL shortening • Click tracking • Geographic analytics • QR codes
          </p>
        </div>
      </footer>
    </div>
  );
}