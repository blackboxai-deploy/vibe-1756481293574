import { NextRequest, NextResponse } from 'next/server';
import { recordClick, incrementClickCount } from '@/lib/storage';
import { getLocationFromIP, getClientIPAddress } from '@/lib/geolocation';
import { Click } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || undefined;
    const ipAddress = getClientIPAddress(request);

    // Get geolocation data
    const location = await getLocationFromIP(ipAddress);

    // Create click record
    const clickRecord: Click = {
      id: Date.now().toString(),
      linkId: shortCode, // Using shortCode as linkId for simplicity
      shortCode,
      timestamp: new Date().toISOString(),
      ipAddress,
      userAgent,
      referer,
      location: location || undefined
    };

    // Record the click
    await recordClick(clickRecord);
    
    // Increment click count
    await incrementClickCount(shortCode);

    return NextResponse.json({ 
      success: true, 
      message: 'Click tracked successfully' 
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track click' },
      { status: 500 }
    );
  }
}