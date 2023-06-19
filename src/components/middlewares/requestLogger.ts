'use strict';

import { createLogger } from '../logger';

const logger = createLogger(module);

export function requestLogger(req, res, next) {
  logger.info(`incoming HTTP request from ${req.ip}: ${req.method} ${req.path}`);

  logger.info(`RID: ${req.rid} TID: ${req.tid}`);

  res.on('timeout', (socket) => {
    logger.error(`request timed out after ${socket.timeout} ms`);
  });

  res.on('close', () => {
    logger.info(`connection ended: RID: ${req.rid}`);
  });

  res.on('finish', () => {
    logger.info(`RID: ${req.rid} status code: ${res.statusCode} duration: ${req.timing.duration} ms`);
  });

  next();
}
