import logger from '$lib/logger';
import auth from 'munhunger-auth-api';

export const get = async (page) => {
  logger.info('starting authentication request');
  let url = auth.beginAuth('devban', 'http://localhost:3000/auth');
  return {
    body: { url }
  };
};
