'use server';

import { cookies } from 'next/headers';
import { deleteSessionByToken } from '../../../database/sessions';

export async function logout() {
  const cookieStore = cookies();
  const token = cookieStore.get('sessionToken'); // get the token from sessiontoken

  // then delete the session from the database
  if (token) await deleteSessionByToken(token.value);

  // set the cookie to be expired
  // -1 means it's expired so meaning delete it
  await cookies().set('sessionToken', '', { maxAge: -1 });
}
