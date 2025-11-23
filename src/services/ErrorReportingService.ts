import { DependencyError } from '../models';

/**
 * Report an error to a logging/monitoring service
 * @param error The error to report
 */
export const reportError = async (error: DependencyError): Promise<void> => {
  // In a real implementation, this would send the error to a logging service like Sentry, etc.
  console.error('Reporting dependency error:', error);
};

/**
 * Format an error for user display
 * @param error The error to format
 * @returns A user-friendly representation of the error
 */
export const formatErrorForUser = (error: DependencyError): string => {
  return `${error.userMessage}\n\nSuggested solution: ${error.suggestedSolution}`;
};