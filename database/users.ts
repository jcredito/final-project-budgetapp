import { cache } from 'react';
import { sql } from './connect';

export type User = {
  id: number;
  username: string;
};

type UserWithPasswordHash = {
  id: number;
  username: string;
  passwordHash: string;
  email: string;
};

export const getUserByUsername = cache(async (username: string) => {
  const [user] = await sql<UserWithPasswordHash[]>`
  SELECT * FROM
  users
  WHERE
  users.username = ${username}
  `;

  return user;
});

export const createUser = cache(
  async (email: string, username: string, passwordHash: string) => {
    const [user] = await sql<UserWithPasswordHash[]>`
  INSERT INTO
  users
  (email, username, password_hash)
  VALUES
  (${email}, ${username}, ${passwordHash})
  RETURNING *
  `;
    return user;
  },
);
