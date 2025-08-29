'use client';

import { useEffect, useRef } from 'react';
import { GeoPoint } from '@/types';

interface ClickMapProps {
  geoData: GeoPoint[];
}

// We'll use a simple world map visualization since Leaflet might have SSR issues
export function ClickMap({ geoData }: ClickMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialize the map on the client side
    if (typeof window !== 'undefined' && mapRef.current) {
      initializeMap();
    }
  }, [geoData]);

  const initializeMap = () => {
    // For now, we'll create a visual representation of the geographic data
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg border border-gray-600">
          <div class="text-center p-8 max-w-md">
            <div class="text-6xl mb-4">🗺️</div>
            <h3 class="text-lg font-semibold text-white mb-2">Geographic Click Distribution</h3>
            <p class="text-gray-300 mb-4">Worldwide click tracking visualization</p>
            ${geoData.length > 0 ? `
              <div class="bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-600">
                <div class="space-y-2 text-sm">
                  <p class="font-medium text-gray-200">Click Locations:</p>
                  ${geoData.slice(0, 8).map(point => `
                    <div class="flex justify-between items-center py-1">
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span class="text-left text-gray-300">${point.city || 'Unknown City'}, ${point.country || 'Unknown Country'}</span>
                      </div>
                      <span class="font-medium text-blue-400">${point.count}</span>
                    </div>
                  `).join('')}
                  ${geoData.length > 8 ? `
                    <div class="text-gray-400 text-xs pt-2 border-t border-gray-600">
                      ... and ${geoData.length - 8} more locations
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : `
              <div class="bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-600">
                <p class="text-sm text-gray-300">No clicks to display yet</p>
                <p class="text-xs text-gray-400 mt-1">Geographic data will appear here as users click your links</p>
              </div>
            `}
          </div>
        </div>
      `;
    }
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-600">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}