import { cache } from 'react';
import { Session } from '../migrations/1687448391-createSessions';
import { sql } from './connect';

// sql check all the record, and check if expiry is less than now(), and delete
export const deleteExpiredSessions = cache(async () => {
  await sql`
    DELETE FROM
      sessions
    WHERE
      expiry_timestamp < now()
  `;
});

// a function that create a session from token
export const createSession = cache(async (token: string, userId: number) => {
  const [session] = await sql<Session[]>`
  INSERT INTO sessions
  (token, user_id)
  VALUES
  (${token}, ${userId})
  RETURNING
  id,
  token,
  user_id
  `;
  // after every new session created, we also call this function
  // delete all sessions that are expired
  await deleteExpiredSessions();

  return session;
});

export const deleteSessionByToken = cache(async (token: string) => {
  const [session] = await sql<{ id: number; token: string }[]>`
    DELETE FROM
      sessions
    WHERE
      sessions.token = ${token}
    RETURNING
      id,
      token
  `;

  return session;
});

// we only want the session if it has a token and
//the expiry timestamp is still bigger than now(not expired)
export const getValidSessionByToken = cache(async (token: string) => {
  // Get the session if match the token AND is not expired
  const [session] = await sql<Session[]>`
    SELECT
      sessions.id,
      sessions.user_id,
      sessions.token
    FROM
      sessions
    WHERE
      sessions.token = ${token}
    AND
      sessions.expiry_timestamp > now()
  `;

  return session;
});
