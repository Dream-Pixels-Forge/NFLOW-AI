import { StartupStatus } from '../models/StartupStatus';
import { checkNodeVersion } from './DependencyChecker';

// In-memory store for startup status
let currentStartupStatus: StartupStatus = {
  status: 'not-started',
  message: 'Application has not begun startup',
  dependenciesVerified: false,
  startTime: new Date(),
  elapsedTime: 0
};

let statusUpdateCallback: ((status: StartupStatus) => void) | null = null;

/**
 * Get the current startup status
 */
export const getStartupStatus = (): StartupStatus => {
  const now = new Date();
  const elapsed = now.getTime() - currentStartupStatus.startTime.getTime();
  return {
    ...currentStartupStatus,
    elapsedTime: elapsed
  };
};

/**
 * Set the current startup status
 */
export const setStartupStatus = (status: Omit<StartupStatus, 'elapsedTime'>): void => {
  currentStartupStatus = {
    ...status,
    elapsedTime: new Date().getTime() - currentStartupStatus.startTime.getTime()
  };
  
  if (statusUpdateCallback) {
    const updatedStatus = getStartupStatus();
    statusUpdateCallback(updatedStatus);
  }
};

/**
 * Initialize the startup tracking
 */
export const initializeStartupTracking = (): void => {
  currentStartupStatus = {
    status: 'not-started',
    message: 'Application has not begun startup',
    dependenciesVerified: false,
    startTime: new Date(),
    elapsedTime: 0
  };
  
  setStartupStatus({
    status: 'verifying-dependencies',
    message: 'Checking dependency status',
    dependenciesVerified: false,
    startTime: currentStartupStatus.startTime
  });
};

/**
 * Set a callback to be notified when the startup status changes
 */
export const setStartupStatusCallback = (callback: (status: StartupStatus) => void): void => {
  statusUpdateCallback = callback;
};

/**
 * Complete the startup process
 */
export const completeStartup = (): void => {
  setStartupStatus({
    status: 'ready',
    message: 'Application is running and ready',
    dependenciesVerified: true,
    startTime: currentStartupStatus.startTime
  });
};

/**
 * Report startup error
 */
export const reportStartupError = (errorMessage: string): void => {
  setStartupStatus({
    status: 'error',
    message: errorMessage,
    dependenciesVerified: false,
    startTime: currentStartupStatus.startTime
  });
};
