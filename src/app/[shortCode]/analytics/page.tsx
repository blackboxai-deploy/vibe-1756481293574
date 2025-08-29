import { AnalyticsDashboard } from '@/components/analytics-dashboard';

interface AnalyticsPageProps {
  params: Promise<{
    shortCode: string;
  }>;
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { shortCode } = await params;

  return <AnalyticsDashboard shortCode={shortCode} />;
}

export async function generateMetadata({ params }: AnalyticsPageProps) {
  const { shortCode } = await params;
  return {
    title: `Analytics for /${shortCode}`,
    description: `View detailed analytics and click tracking data for shortened link /${shortCode}`,
  };
}