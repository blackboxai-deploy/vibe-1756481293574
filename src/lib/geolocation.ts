import { ClickLocation, GeolocationResponse } from '@/types';

// Free IP geolocation service (no API key required)
const GEOLOCATION_API = 'http://ip-api.com/json';

export async function getLocationFromIP(ipAddress: string): Promise<ClickLocation | null> {
  try {
    // For demo purposes, handle localhost and private IPs
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')) {
      return {
        country: 'Local Development',
        countryCode: 'DEV',
        region: 'Local',
        city: 'Localhost',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York'
      };
    }

    const response = await fetch(`${GEOLOCATION_API}/${ipAddress}?fields=status,message,country,countryCode,region,city,lat,lon,timezone,query`);
    
    if (!response.ok) {
      console.error('Geolocation API request failed:', response.status);
      return null;
    }

    const data: GeolocationResponse = await response.json();

    if (data.country && data.lat && data.lon) {
      return {
        country: data.country,
        countryCode: data.countryCode,
        region: data.region,
        city: data.city,
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return null;
  }
}

export function getClientIPAddress(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (remoteAddr) {
    return remoteAddr;
  }

  // Fallback to localhost for development
  return '127.0.0.1';
}

// Generate sample geographic data for demo purposes
export function generateSampleGeoData() {
  const sampleLocations = [
    { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060, clicks: 15 },
    { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, clicks: 12 },
    { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, clicks: 8 },
    { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, clicks: 10 },
    { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, clicks: 6 },
    { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, clicks: 7 },
    { city: 'São Paulo', country: 'Brazil', lat: -23.5558, lng: -46.6396, clicks: 9 },
    { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, clicks: 11 },
    { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, clicks: 5 },
    { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, clicks: 4 }
  ];

  return sampleLocations.map(location => ({
    latitude: location.lat,
    longitude: location.lng,
    count: location.clicks,
    city: location.city,
    country: location.country
  }));
}