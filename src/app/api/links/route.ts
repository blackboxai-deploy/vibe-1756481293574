import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllLinks, 
  createLink, 
  generateShortCode, 
  isShortCodeAvailable, 
  isValidUrl, 
  isValidCustomAlias 
} from '@/lib/storage';
import { Link, CreateLinkRequest, CreateLinkResponse } from '@/types';

export async function GET() {
  try {
    const links = await getAllLinks();
    return NextResponse.json({ success: true, links });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateLinkRequest = await request.json();
    const { url, customAlias, expiresAt } = body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Generate or validate short code
    let shortCode: string;
    
    if (customAlias) {
      if (!isValidCustomAlias(customAlias)) {
        return NextResponse.json(
          { success: false, error: 'Invalid custom alias. Use 3-20 alphanumeric characters, hyphens, or underscores only.' },
          { status: 400 }
        );
      }
      
      if (!(await isShortCodeAvailable(customAlias))) {
        return NextResponse.json(
          { success: false, error: 'Custom alias is already taken' },
          { status: 400 }
        );
      }
      
      shortCode = customAlias;
    } else {
      // Generate unique short code
      do {
        shortCode = generateShortCode();
      } while (!(await isShortCodeAvailable(shortCode)));
    }

    // Check for existing URL
    const existingLinks = await getAllLinks();
    const existingLink = existingLinks.find(link => link.originalUrl === url);
    
    if (existingLink) {
      return NextResponse.json({ 
        success: true, 
        link: existingLink,
        message: 'URL already shortened'
      });
    }

    // Create new link
    const newLink: Link = {
      id: Date.now().toString(),
      shortCode,
      originalUrl: url,
      customAlias: customAlias || undefined,
      createdAt: new Date().toISOString(),
      clickCount: 0,
      expiresAt: expiresAt || undefined,
      isActive: true
    };

    const createdLink = await createLink(newLink);

    const response: CreateLinkResponse = {
      success: true,
      link: createdLink
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create link' },
      { status: 500 }
    );
  }
}