import React from 'react';
import { DependencyError } from '../models';

interface DependencyErrorDisplayProps {
  error: DependencyError;
  onRetry?: () => void;
}

const DependencyErrorDisplay: React.FC<DependencyErrorDisplayProps> = ({ error, onRetry }) => {
  const getErrorColor = () => {
    switch (error.severity) {
      case 'critical': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`p-4 rounded border-l-4 ${getErrorColor()} bg-red-900/20 border-${error.severity === 'critical' ? 'red' : error.severity === 'warning' ? 'yellow' : 'blue'}-500`}>
      <h3 className={`font-bold ${getErrorColor()}`}>Dependency Error: {error.dependencyName}</h3>
      <p className="mt-2 text-gray-300">{error.userMessage}</p>
      <p className="mt-2 text-gray-400 text-sm">{error.suggestedSolution}</p>
      <div className="mt-4 flex gap-2">
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-3 py-1 bg-nexus-accent text-black rounded hover:bg-opacity-80 transition-colors"
          >
            Retry
          </button>
        )}
        <button 
          onClick={() => console.log('View details:', error)}
          className="px-3 py-1 bg-nexus-800 rounded border border-nexus-border hover:bg-nexus-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default DependencyErrorDisplay;