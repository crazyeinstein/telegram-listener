'use strict';

import * as config from 'config';
import { current } from './context';
import * as winston from 'winston';

let consoleTransportAdded = false;

const formatContext = function () {
  const ctx = current();

  if (ctx === null) {
    return '[GLOBAL]';
  }

  switch (ctx.name) {
    case 'http':
      return `[${ctx.data.rid}] [${ctx.data.method.padStart(6)} ${
        ctx.data.path
      }]`;
    // Stands for: Telegram Message
    case 'tgm':
      return `[tgm-${ctx.data.id}]`;
    default:
      return ctx.name;
  }
};

const getModuleName = function (callingModule) {
  if (!callingModule) {
    return '';
  }
  if (!callingModule.filename) {
    return callingModule.id;
  }

  const parts = callingModule.filename.split('/');

  return `${parts[parts.length - 2]}/${parts.pop()}`;
};

export function createLogger(callingModule) {
  const logger = winston.createLogger({
    exitOnError: false,
  });

  const label = getModuleName(callingModule);
  const level = config.get<string>('logLevel');

  logger.add(
    new winston.transports.Console({
      level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.label({ label }),
        winston.format((info) => {
          info.ctx = formatContext();

          return info;
        })(),
        winston.format.printf((info) => {
          return `${info.timestamp} ${info.level.padStart(16)} ${info.ctx} ${
            info.label
          }:  ${info.message}`;
        }),
      ),
    }),
  );

  if (consoleTransportAdded === false) {
    consoleTransportAdded = true;

    logger.exceptions.handle(new winston.transports.Console({}));
  }

  return {
    error: function (message, ...rest) {
      logger.error(message, ...rest);
    },
    warn: function (message, ...rest) {
      logger.warn(message, ...rest);
    },
    info: function (message, ...rest) {
      logger.info(message, ...rest);
    },
    debug: function (message, ...rest) {
      logger.debug(message, ...rest);
    },
  };
}
