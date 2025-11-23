import logger from '../logger.js'

export default function errorHandler(err, req, res, next) {
  logger.error(err); // Winston logs stack trace automatically

  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
}


