'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClickMap } from './click-map';
import { Analytics } from '@/types';

interface AnalyticsDashboardProps {
  shortCode: string;
}

export function AnalyticsDashboard({ shortCode }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/analytics/${shortCode}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        setError(data.error || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('An error occurred while fetching analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shortCode) {
      fetchAnalytics();
    }
  }, [shortCode]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
              <p className="text-gray-300 mb-4">{error}</p>
              <Button onClick={fetchAnalytics} className="bg-blue-600 hover:bg-blue-700 text-white">Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-semibold text-gray-300 mb-2">No Data Found</h2>
              <p className="text-gray-400">Analytics data is not available for this link.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Link Analytics</h1>
              <p className="text-gray-300">/{analytics.link.shortCode}</p>
            </div>
            <Badge variant="secondary" className={analytics.link.isActive ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}>
              {analytics.link.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <div className="bg-gray-700 rounded p-3 mb-4">
            <p className="text-sm text-gray-300 break-all">{analytics.link.originalUrl}</p>
          </div>
          
          <div className="text-sm text-gray-400">
            Created {formatDate(analytics.link.createdAt)}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-400">{analytics.totalClicks}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">{analytics.clicksToday}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-400">{analytics.clicksThisWeek}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-400">{analytics.clicksThisMonth}</p>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Map */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ClickMap geoData={analytics.geoData} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Countries */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top Countries</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topCountries.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topCountries.map((country, index) => (
                    <div key={country.countryCode} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                        <span className="font-medium text-gray-200">{country.country}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{country.count}</span>
                        <span className="text-sm text-gray-400">({formatPercentage(country.percentage)})</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No country data available</p>
              )}
            </CardContent>
          </Card>

          {/* Top Devices */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Device Types</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topDevices.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topDevices.map((device, index) => (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                        <span className="font-medium capitalize text-gray-200">{device.device}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{device.count}</span>
                        <span className="text-sm text-gray-400">({formatPercentage(device.percentage)})</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No device data available</p>
              )}
            </CardContent>
          </Card>

          {/* Top Browsers */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top Browsers</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topBrowsers.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topBrowsers.map((browser, index) => (
                    <div key={browser.browser} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                        <span className="font-medium text-gray-200">{browser.browser}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{browser.count}</span>
                        <span className="text-sm text-gray-400">({formatPercentage(browser.percentage)})</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No browser data available</p>
              )}
            </CardContent>
          </Card>

          {/* Top Referrers */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top Referrers</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topReferrers.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topReferrers.map((referrer, index) => (
                    <div key={referrer.domain} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                        <span className="font-medium text-gray-200">{referrer.domain}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{referrer.count}</span>
                        <span className="text-sm text-gray-400">({formatPercentage(referrer.percentage)})</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No referrer data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Clicks */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.recentClicks.length > 0 ? (
              <div className="space-y-3">
                {analytics.recentClicks.map((click) => (
                  <div key={click.id} className="flex items-center justify-between py-2 border-b border-gray-700">
                    <div>
                      <p className="font-medium text-sm text-gray-200">
                        {click.location?.city || 'Unknown City'}, {click.location?.country || 'Unknown Country'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {click.referer ? new URL(click.referer).hostname : 'Direct'}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      {formatDate(click.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No recent clicks</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}