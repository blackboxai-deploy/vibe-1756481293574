export interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  customAlias?: string;
  createdAt: string;
  clickCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface Click {
  id: string;
  linkId: string;
  shortCode: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  referer?: string;
  location?: ClickLocation;
}

export interface ClickLocation {
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface Analytics {
  link: Link;
  totalClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
  recentClicks: Click[];
  topCountries: CountryStats[];
  topDevices: DeviceStats[];
  topBrowsers: BrowserStats[];
  topReferrers: ReferrerStats[];
  clickTimeline: TimelineData[];
  geoData: GeoPoint[];
}

export interface CountryStats {
  country: string;
  countryCode: string;
  count: number;
  percentage: number;
}

export interface DeviceStats {
  device: string;
  count: number;
  percentage: number;
}

export interface BrowserStats {
  browser: string;
  version?: string;
  count: number;
  percentage: number;
}

export interface ReferrerStats {
  domain: string;
  count: number;
  percentage: number;
}

export interface TimelineData {
  date: string;
  clicks: number;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
  count: number;
  city?: string;
  country?: string;
}

export interface CreateLinkRequest {
  url: string;
  customAlias?: string;
  expiresAt?: string;
}

export interface CreateLinkResponse {
  success: boolean;
  link?: Link;
  error?: string;
}

export interface TrackClickRequest {
  userAgent: string;
  referer?: string;
  ipAddress: string;
}

export interface GeolocationResponse {
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  query: string;
}