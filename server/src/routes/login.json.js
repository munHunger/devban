import logger from '$lib/logger';
import auth from 'munhunger-auth-api';

export const get = async (page) => {
  logger.info('starting authentication request');
  let url = auth.beginAuth('devban', 'https://devban.munhunger.com/auth');
  return {
    body: { url }
  };
};
