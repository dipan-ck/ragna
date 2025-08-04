import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
    <h3 className="text-lg font-medium text-white mb-2">Failed to load files</h3>
    <p className="text-gray-400 mb-4">{error.message}</p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      Try Again
    </button>
  </div>
);

export default ErrorState; 