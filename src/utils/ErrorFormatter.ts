import { DependencyError } from '../models';

/**
 * Format a dependency error for user display
 * @param error The dependency error to format
 * @returns A user-friendly string representation of the error
 */
export const formatDependencyError = (error: DependencyError): string => {
  return `${error.userMessage}\n\nSuggested solution: ${error.suggestedSolution}`;
};

/**
 * Format an error with additional context
 * @param error The dependency error to format
 * @returns A detailed, user-friendly representation with context
 */
export const formatDependencyErrorWithContext = (error: DependencyError): string => {
  const severityLabel = error.severity.charAt(0).toUpperCase() + error.severity.slice(1);
  
  return `
${severityLabel} Error: ${error.dependencyName}
-----------------------------
${error.userMessage}

Technical Details:
${error.errorMessage}

Recommended Action:
${error.suggestedSolution}

Error ID: ${error.errorId}
Timestamp: ${error.timestamp.toISOString()}
  `.trim();
};