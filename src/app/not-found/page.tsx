export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-white mb-2">Link Not Found</h1>
        <p className="text-gray-300 mb-6">
          The shortened link you're looking for doesn't exist or has been removed.
        </p>
        <a 
          href="/" 
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Link
        </a>
      </div>
    </div>
  );
}