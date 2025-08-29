import { Link, Click } from '@/types';
import { createLink, recordClick } from './storage';

export async function generateSampleData() {
  // Create some sample links
  const sampleLinks: Link[] = [
    {
      id: '1',
      shortCode: 'demo1',
      originalUrl: 'https://example.com/very-long-url-that-needs-shortening-for-better-sharing',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      clickCount: 15,
      isActive: true
    },
    {
      id: '2', 
      shortCode: 'github',
      originalUrl: 'https://github.com/username/repository-name-that-is-quite-long',
      customAlias: 'github',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      clickCount: 23,
      isActive: true
    },
    {
      id: '3',
      shortCode: 'portfolio',
      originalUrl: 'https://myportfolio.com/work/project/detailed-case-study-with-images-and-description',
      customAlias: 'portfolio',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      clickCount: 8,
      isActive: true
    }
  ];

  // Sample click data with geographic distribution
  const sampleClicks: Click[] = [
    // Recent clicks for demo1
    {
      id: 'c1',
      linkId: '1',
      shortCode: 'demo1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      referer: 'https://twitter.com',
      location: {
        country: 'United States',
        countryCode: 'US',
        region: 'New York',
        city: 'New York',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York'
      }
    },
    {
      id: 'c2',
      linkId: '1',
      shortCode: 'demo1',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      location: {
        country: 'United Kingdom',
        countryCode: 'GB',
        region: 'England', 
        city: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        timezone: 'Europe/London'
      }
    },
    {
      id: 'c3',
      linkId: '2',
      shortCode: 'github',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      ipAddress: '172.16.0.25',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      referer: 'https://linkedin.com',
      location: {
        country: 'Japan',
        countryCode: 'JP',
        region: 'Tokyo',
        city: 'Tokyo', 
        latitude: 35.6762,
        longitude: 139.6503,
        timezone: 'Asia/Tokyo'
      }
    },
    {
      id: 'c4',
      linkId: '2',
      shortCode: 'github',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      ipAddress: '192.168.2.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      location: {
        country: 'Germany',
        countryCode: 'DE', 
        region: 'Berlin',
        city: 'Berlin',
        latitude: 52.5200,
        longitude: 13.4050,
        timezone: 'Europe/Berlin'
      }
    },
    {
      id: 'c5',
      linkId: '3',
      shortCode: 'portfolio',
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      ipAddress: '203.0.113.42',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      referer: 'https://facebook.com',
      location: {
        country: 'Australia', 
        countryCode: 'AU',
        region: 'New South Wales',
        city: 'Sydney',
        latitude: -33.8688,
        longitude: 151.2093,
        timezone: 'Australia/Sydney'
      }
    }
  ];

  // Add sample data to storage
  for (const link of sampleLinks) {
    await createLink(link);
  }

  for (const click of sampleClicks) {
    await recordClick(click);
  }

  console.log('Sample data generated successfully');
}

// Initialize sample data if needed
export async function initializeSampleDataIfEmpty() {
  const { getAllLinks } = await import('./storage');
  const existingLinks = await getAllLinks();
  
  if (existingLinks.length === 0) {
    await generateSampleData();
  }
}