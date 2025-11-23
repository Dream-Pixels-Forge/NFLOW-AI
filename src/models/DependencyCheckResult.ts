import { Dependency } from './Dependency';

export interface DependencyCheckResult {
  timestamp: Date;
  success: boolean;
  missingDependencies: Dependency[];
  incompatibleDependencies: Dependency[];
  message: string;
  actionSteps: string[];
}