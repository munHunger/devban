import winston from 'winston';
const options = {
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { labels: { service: 'devban', host: process.env['HOSTNAME'] } },
	transports: [
		//
		// - Write all logs with level `error` and below to `error.log`
		// - Write all logs with level `info` and below to `combined.log`
		//
		new winston.transports.Console({
			level: 'info',
			format: winston.format.combine(winston.format.colorize(), winston.format.simple())
		})
	]
};
export const logger = winston.createLogger(options);
logger.info('setting up logger');

export default { logger };
