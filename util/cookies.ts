import { cookies } from 'next/headers';

export function getCookie(name: string) {
  return cookies().get(name)?.value;
}

// first we have to check if we are in production or not
// production is where u are in deployment(fly.io)
// we need this boolean variable:
// production mode = true
// dev mode = false
//const isProduction = process.env.NODE_ENV === 'production';

// maxAge to set also the cookie expiration after 24 hours
// we'll have 2 different kind of expiration,
// we delete the cookie itself and we check the session is not available
// const maxAge = 60 * 60 * 24; // 24 hours in seconds

export const secureCookieOptions = {
  httpOnly: true, // only cookie from http protocol
  path: '/', // a variable for the full app
  secure: process.env.NODE_ENV === 'production', //process.envì- enviromental variable
  maxAge: 60 * 60 * 24,
  // Be explicit about new default behavior
  // in browsers
  // https://web.dev/samesite-cookies-explained/
  sameSite: 'lax', // this prevents CSRF attacks
} as const; // it make the code read that the type of sameSite is lax not a string
