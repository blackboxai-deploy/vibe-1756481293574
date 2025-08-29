'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function RedirectPage() {
  const params = useParams();
  const shortCode = Array.isArray(params.shortCode) ? params.shortCode[0] : params.shortCode;

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // First, track the click
        await fetch(`/api/track/${shortCode}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        // Then get the original URL and redirect
        const response = await fetch(`/api/links`);
        const data = await response.json();
        
        if (data.success && data.links) {
          const link = data.links.find((l: any) => l.shortCode === shortCode);
          
          if (link && link.isActive) {
            // Check if link has expired
            if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
              window.location.href = '/expired';
              return;
            }
            
            // Redirect to original URL
            window.location.href = link.originalUrl;
          } else {
            window.location.href = '/not-found';
          }
        } else {
          window.location.href = '/not-found';
        }
      } catch (error) {
        console.error('Error during redirect:', error);
        window.location.href = '/error';
      }
    };

    if (shortCode) {
      handleRedirect();
    }
  }, [shortCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Redirecting...</h2>
        <p className="text-gray-300">Please wait while we redirect you to your destination.</p>
      </div>
    </div>
  );
}