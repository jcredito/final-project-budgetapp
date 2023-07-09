import { cache } from 'react';
import { sql } from './connect';
import { User } from '../migrations/1687125158-createUsers';

type UserWithPasswordHash = User & {
  passwordHash: string;
};

export const getUserWithPasswordHashByUsername = cache(
  async (username: string) => {
    const [user] = await sql<UserWithPasswordHash[]>`
  SELECT
  *
  FROM
  users
  WHERE
  users.username = ${username.toLowerCase()}
  `;

    return user;
  },
);

export const getUserByUsername = cache(async (username: string) => {
  const [user] = await sql<User[]>`
  SELECT
  id,
  username
  FROM
  users
  WHERE
  users.username = ${username.toLowerCase()}
  `;

  return user;
});

export const createUser = cache(
  async (email: string, username: string, passwordHash: string) => {
    const [user] = await sql<User[]>`
  INSERT INTO
  users
  (email, username, password_hash)
  VALUES
  (${email}, ${username.toLowerCase()}, ${passwordHash})
  RETURNING
  id,
  username
  `;
    return user;
  },
);

// we check here 1. that the token im passing has a valid session
// 2. the session is not expire
// 3. im querying another data from another table based on that specific column (users.id)
export const getUserBySessionToken = cache(async (token: string) => {
  const [user] = await sql<User[]>`
  SELECT
    users.id,
    users.username,
    users.email
  FROM
    users
  INNER JOIN
    sessions ON (
      sessions.token = ${token} AND
      sessions.user_id = users.id AND
      sessions.expiry_timestamp > now()
    )
  `;

  return user;
});
