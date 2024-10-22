export enum LOG_LEVELS_ENUM {
  INFO = 'INFO', // Information
  WARN = 'WARN', // Warning
  CRITICAL = 'CRITICAL', // Error level - 2
  ERROR = 'ERROR', // Error level - 1
  DEBUG = 'DEBUG', // Debug
  VERBOSE = 'VERBOSE', // Verbose
}

export type LogLevelsType = keyof typeof LOG_LEVELS_ENUM;
