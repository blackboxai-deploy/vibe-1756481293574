import { NextRequest, NextResponse } from 'next/server';
import { getLinkByShortCode, getClicksByShortCode } from '@/lib/storage';
import { calculateAnalytics } from '@/lib/analytics';
import { Analytics } from '@/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    // Get the link
    const link = await getLinkByShortCode(shortCode);
    
    if (!link) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    // Get all clicks for this link
    const clicks = await getClicksByShortCode(shortCode);

    // Calculate analytics
    const analyticsData = calculateAnalytics(clicks);

    const fullAnalytics: Analytics = {
      link,
      ...analyticsData
    };

    return NextResponse.json({ 
      success: true, 
      analytics: fullAnalytics 
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}