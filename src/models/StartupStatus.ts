export interface StartupStatus {
  status: 'not-started' | 'verifying-dependencies' | 'dependencies-ok' | 'starting' | 'ready' | 'error';
  message: string;
  dependenciesVerified: boolean;
  startTime: Date;
  elapsedTime: number; // milliseconds
}