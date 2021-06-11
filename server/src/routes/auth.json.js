import mongo from '$lib/mongo';
import logger from '$lib/logger';
import { Config } from '$lib/type/config';
import auth from 'munhunger-auth-api';

const jwtSecret = process.env['JWT_SECRET'] || 'secret';
export const get = async (page) => {
  let name = 'devban';
  let db = await mongo.db(name);
  logger.info('finalizing authentication');
  let token = page.query.get('token');
  token = decodeURIComponent(token);
  let serviceSecret = (await Config.readConfig(db)).authSecret.authSecret;
  logger.info(`requesting jwt`, { serviceSecret, token });
  let jwt = await auth.auth('devban', token, serviceSecret, jwtSecret);
  if (jwt) {
    logger.info('authentication successful', { jwt });
    page.locals.jwt = jwt;
    return {
      headers: {
        'Set-Cookie': `token=${jwt}`
      },
      body: jwt,
      status: 200
    };
  } else {
    logger.warn(`invalid JWT from auth`, { jwt });
    return {
      status: 403
    };
  }
};
