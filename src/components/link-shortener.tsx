'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


interface LinkShortenerProps {
  onLinkCreated: () => void;
}

export function LinkShortener({ onLinkCreated }: LinkShortenerProps) {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedLink, setShortenedLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setShortenedLink(null);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          customAlias: customAlias.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const shortUrl = `${window.location.origin}/${data.link.shortCode}`;
        setShortenedLink(shortUrl);
        setUrl('');
        setCustomAlias('');
        onLinkCreated();
        alert('Link shortened successfully!');
      } else {
        alert(data.error || 'Failed to shorten link');
      }
    } catch (error) {
      console.error('Error shortening link:', error);
      alert('An error occurred while shortening the link');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shortenedLink) {
      try {
        await navigator.clipboard.writeText(shortenedLink);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Failed to copy link');
      }
    }
  };

  const generateQRCode = () => {
    if (shortenedLink) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shortenedLink)}`;
      window.open(qrUrl, '_blank');
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Link Shortener</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-gray-200">Long URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customAlias" className="text-gray-200">Custom Alias (Optional)</Label>
            <Input
              id="customAlias"
              type="text"
              placeholder="my-custom-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              pattern="[a-zA-Z0-9_-]+"
              title="Only letters, numbers, hyphens, and underscores allowed"
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            />
            <p className="text-sm text-gray-400">
              Leave empty for auto-generated code. 3-20 characters, letters, numbers, hyphens, and underscores only.
            </p>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Shortening...</span>
              </div>
            ) : (
              'Shorten Link'
            )}
          </Button>
        </form>

        {shortenedLink && (
          <div className="p-4 bg-green-900 border border-green-700 rounded-lg space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-700 text-green-100">Success</Badge>
              <span className="text-sm text-green-200 font-medium">Your shortened link is ready!</span>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-200">Shortened URL</Label>
              <div className="flex space-x-2">
                <Input 
                  value={shortenedLink} 
                  readOnly 
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={copyToClipboard}
                  className="px-3 border-gray-600 text-gray-200 hover:bg-gray-700"
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={generateQRCode}
                className="border-gray-600 text-gray-200 hover:bg-gray-700"
              >
                Generate QR Code
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`/${shortenedLink.split('/').pop()}/analytics`, '_blank')}
                className="border-gray-600 text-gray-200 hover:bg-gray-700"
              >
                View Analytics
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}