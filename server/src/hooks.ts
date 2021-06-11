import { logger } from '$lib/logger';
import { defaultState } from '$lib/store';
import * as cookie from 'cookie';
import auth from 'munhunger-auth-api';

const jwtSecret = process.env['JWT_SECRET'] || 'secret';
export async function handle({ request, resolve }) {
  const headers = request.headers;
  const cookies = cookie.parse(headers.cookie || '');
  request.locals.token = cookies['token'];
  if (request.locals.token) {
    let user = auth.verify(request.locals.token, jwtSecret);
    request.locals.authenticated = user !== undefined;
    logger.debug('authenticated', user);
  }
  const response = await resolve(request);
  return {
    ...response
  };
}

export const getSession = async (req) => {
  let initialState = { ...defaultState };
  let token = req.locals.token;
  if (token) {
    let user = auth.verify(token, jwtSecret);
    logger.info(`authenticated user`, { user });
    initialState.authenticated = user !== undefined;
    initialState.user = user;
    initialState.token = token;
  }
  return initialState;
};
