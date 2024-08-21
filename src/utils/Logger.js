// Logger.js
// This utility module provides a flexible and professional logging mechanism for the P2P exchange system.

const winston = require("winston");

// Define log levels and corresponding colors for better visibility in the console
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
  },
};

// Apply the colors to Winston (used in console transports)
winston.addColors(logLevels.colors);

// Create the Winston logger with different transports (console, file)
const Logger = winston.createLogger({
  levels: logLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(), // Apply colors to log levels in the console
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      level: "debug", // Log everything from 'debug' and above to the console
      handleExceptions: true, // Handle exceptions and output them in the logs
    }),
    new winston.transports.File({
      filename: "logs/app.log",
      level: "info", // Log only 'info' level and above to the file
      handleExceptions: true, // Handle exceptions and output them in the logs
      maxsize: 5242880, // 5MB max file size before rotation
      maxFiles: 5, // Keep up to 5 rotated log files
      format: winston.format.combine(
        winston.format.uncolorize(), // Remove colors for file logs
        winston.format.json() // Store logs in JSON format for better parsing
      ),
    }),
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

// Export the logger to be used in other modules
module.exports = Logger;
