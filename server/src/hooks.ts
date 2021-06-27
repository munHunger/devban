import { logger } from '$lib/logger';
import { defaultState } from '$lib/store';
import * as cookie from 'cookie';
import auth from 'munhunger-auth-api';

export async function handle({ request, resolve }) {
  const headers = request.headers;
  const cookies = cookie.parse(headers.cookie || '');
  request.locals.token = cookies['token'];
  if (request.locals.token) {
    request.locals.user = await auth.verify(request.locals.token);
    request.locals.authenticated = request.locals.user !== undefined;
    logger.debug('authenticated', request.locals.user);
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
    let user = await auth.verify(token);
    logger.info(`authenticated user`, { user });
    initialState.authenticated = user !== undefined;
    initialState.user = user;
    initialState.token = token;
  }
  return initialState;
};
