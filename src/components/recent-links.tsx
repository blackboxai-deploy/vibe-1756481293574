'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/types';

interface RecentLinksProps {
  refreshTrigger: number;
}

export function RecentLinks({ refreshTrigger }: RecentLinksProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      const data = await response.json();
      
      if (data.success && data.links) {
        // Sort by creation date, most recent first
        const sortedLinks = data.links.sort((a: Link, b: Link) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLinks(sortedLinks.slice(0, 10)); // Show only last 10 links
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [refreshTrigger]);

  const copyToClipboard = async (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy link');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Links</CardTitle>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No links created yet.</p>
            <p className="text-sm">Create your first shortened link above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="p-4 border border-gray-600 rounded-lg hover:shadow-lg hover:border-gray-500 transition-all bg-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                        /{link.shortCode}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-blue-900 text-blue-200">
                        {link.clickCount} clicks
                      </Badge>
                      {link.customAlias && (
                        <Badge variant="default" className="text-xs bg-green-900 text-green-200">
                          Custom
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 break-all">
                      {truncateUrl(link.originalUrl)}
                    </p>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(link.shortCode)}
                      className="text-xs px-2 py-1 border-gray-600 text-gray-200 hover:bg-gray-600"
                    >
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/${link.shortCode}/analytics`, '_blank')}
                      className="text-xs px-2 py-1 border-gray-600 text-gray-200 hover:bg-gray-600"
                    >
                      Analytics
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  Created {formatDate(link.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}