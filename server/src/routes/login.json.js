import { logger } from '$lib/logger';
import { authServiceName, devbanHost } from '$lib/type/config';
import auth from 'munhunger-auth-api';

export const get = async (page) => {
  logger.info('starting authentication request');
  let url = auth.beginAuth(authServiceName, `${devbanHost}/auth`);
  return {
    body: { url }
  };
};
