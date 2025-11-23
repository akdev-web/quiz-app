
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} | ${level.toUpperCase()} | ${stack || message}`;
});

const logger = createLogger({
  level: 'error',
  format: combine(
    timestamp(),
    errors({ stack: true }),   // <-- This enables stack trace
    logFormat
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log' }),   // write errors to file
    new transports.Console()                               // also show in console
  ]
});

export default logger;
