import { Link, Click } from '@/types';

// In-memory storage for demo purposes
let links: Link[] = [];
let clicks: Click[] = [];

// For production, you would use a real database
// This is a simple in-memory implementation for demo

// Generic storage operations
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Link operations
export async function getAllLinks(): Promise<Link[]> {
  return deepClone(links);
}

export async function getLinkByShortCode(shortCode: string): Promise<Link | null> {
  const link = links.find(link => link.shortCode === shortCode);
  return link ? deepClone(link) : null;
}

export async function createLink(link: Link): Promise<Link> {
  links.push(deepClone(link));
  return deepClone(link);
}

export async function updateLink(shortCode: string, updates: Partial<Link>): Promise<Link | null> {
  const index = links.findIndex(link => link.shortCode === shortCode);
  
  if (index === -1) return null;
  
  links[index] = { ...links[index], ...updates };
  return deepClone(links[index]);
}

export async function incrementClickCount(shortCode: string): Promise<void> {
  const index = links.findIndex(link => link.shortCode === shortCode);
  
  if (index !== -1) {
    links[index].clickCount += 1;
  }
}

// Click operations
export async function getAllClicks(): Promise<Click[]> {
  return deepClone(clicks);
}

export async function getClicksByShortCode(shortCode: string): Promise<Click[]> {
  return deepClone(clicks.filter(click => click.shortCode === shortCode));
}

export async function recordClick(click: Click): Promise<Click> {
  clicks.push(deepClone(click));
  return deepClone(click);
}

// Utility functions
export function generateShortCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function isShortCodeAvailable(shortCode: string): Promise<boolean> {
  const link = await getLinkByShortCode(shortCode);
  return !link;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidCustomAlias(alias: string): boolean {
  // Allow alphanumeric characters, hyphens, and underscores
  const regex = /^[a-zA-Z0-9_-]+$/;
  return regex.test(alias) && alias.length >= 3 && alias.length <= 20;
}