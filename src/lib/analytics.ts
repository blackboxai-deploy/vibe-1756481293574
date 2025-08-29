import { Click, Analytics, CountryStats, DeviceStats, BrowserStats, ReferrerStats, TimelineData, GeoPoint } from '@/types';
const UAParser = require('ua-parser-js');

export function calculateAnalytics(clicks: Click[]): Omit<Analytics, 'link'> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Basic metrics
  const totalClicks = clicks.length;
  const clicksToday = clicks.filter(click => new Date(click.timestamp) >= today).length;
  const clicksThisWeek = clicks.filter(click => new Date(click.timestamp) >= weekAgo).length;
  const clicksThisMonth = clicks.filter(click => new Date(click.timestamp) >= monthAgo).length;

  // Recent clicks (last 10)
  const recentClicks = [...clicks].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 10);

  // Geographic stats
  const countryMap = new Map<string, { name: string; code: string; count: number }>();
  const geoPoints: GeoPoint[] = [];

  clicks.forEach(click => {
    if (click.location?.country && click.location?.countryCode) {
      const key = click.location.countryCode;
      const existing = countryMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        countryMap.set(key, {
          name: click.location.country,
          code: click.location.countryCode,
          count: 1
        });
      }

      // Add to geo points if coordinates are available
      if (click.location.latitude && click.location.longitude) {
        const existingPoint = geoPoints.find(p => 
          Math.abs(p.latitude - click.location!.latitude!) < 0.1 &&
          Math.abs(p.longitude - click.location!.longitude!) < 0.1
        );

        if (existingPoint) {
          existingPoint.count += 1;
        } else {
          geoPoints.push({
            latitude: click.location.latitude,
            longitude: click.location.longitude,
            count: 1,
            city: click.location.city,
            country: click.location.country
          });
        }
      }
    }
  });

  const topCountries: CountryStats[] = Array.from(countryMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(country => ({
      country: country.name,
      countryCode: country.code,
      count: country.count,
      percentage: totalClicks > 0 ? (country.count / totalClicks) * 100 : 0
    }));

  // Device stats
  const deviceMap = new Map<string, number>();
  const browserMap = new Map<string, number>();

  clicks.forEach(click => {
    if (click.userAgent) {
      const parser = new UAParser(click.userAgent);
      const device = parser.getDevice();
      const browser = parser.getBrowser();

      // Device type
      const deviceType = device.type || 'desktop';
      deviceMap.set(deviceType, (deviceMap.get(deviceType) || 0) + 1);

      // Browser
      const browserName = browser.name || 'Unknown';
      browserMap.set(browserName, (browserMap.get(browserName) || 0) + 1);
    }
  });

  const topDevices: DeviceStats[] = Array.from(deviceMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([device, count]) => ({
      device,
      count,
      percentage: totalClicks > 0 ? (count / totalClicks) * 100 : 0
    }));

  const topBrowsers: BrowserStats[] = Array.from(browserMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: totalClicks > 0 ? (count / totalClicks) * 100 : 0
    }));

  // Referrer stats
  const referrerMap = new Map<string, number>();
  clicks.forEach(click => {
    if (click.referer) {
      try {
        const url = new URL(click.referer);
        const domain = url.hostname.replace('www.', '');
        referrerMap.set(domain, (referrerMap.get(domain) || 0) + 1);
      } catch {
        referrerMap.set('Direct', (referrerMap.get('Direct') || 0) + 1);
      }
    } else {
      referrerMap.set('Direct', (referrerMap.get('Direct') || 0) + 1);
    }
  });

  const topReferrers: ReferrerStats[] = Array.from(referrerMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([domain, count]) => ({
      domain,
      count,
      percentage: totalClicks > 0 ? (count / totalClicks) * 100 : 0
    }));

  // Timeline data (last 30 days)
  const timelineMap = new Map<string, number>();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    return date.toISOString().split('T')[0];
  }).reverse();

  // Initialize all dates with 0
  last30Days.forEach(date => {
    timelineMap.set(date, 0);
  });

  // Count clicks by date
  clicks.forEach(click => {
    const clickDate = new Date(click.timestamp).toISOString().split('T')[0];
    if (timelineMap.has(clickDate)) {
      timelineMap.set(clickDate, timelineMap.get(clickDate)! + 1);
    }
  });

  const clickTimeline: TimelineData[] = Array.from(timelineMap.entries()).map(([date, clicks]) => ({
    date,
    clicks
  }));

  return {
    totalClicks,
    clicksToday,
    clicksThisWeek,
    clicksThisMonth,
    recentClicks,
    topCountries,
    topDevices,
    topBrowsers,
    topReferrers,
    clickTimeline,
    geoData: geoPoints
  };
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
}

export function getRelativeTime(date: string): string {
  const now = new Date();
  const clickDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - clickDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
}