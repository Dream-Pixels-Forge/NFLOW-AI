export interface DependencyError {
  errorId: string;
  timestamp: Date;
  dependencyName: string;
  errorMessage: string;
  userMessage: string;
  suggestedSolution: string;
  severity: 'critical' | 'warning' | 'info';
}