import winston from 'winston';
import LokiTransport from 'winston-loki';
const options = {
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { labels: { service: 'devban', host: process.env['HOSTNAME'] } },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new LokiTransport({
      host: 'https://loki.munhunger.com'
    }),
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    })
  ]
};
export const logger = winston.createLogger(options);
logger.info('setting up logger');

export default logger;
