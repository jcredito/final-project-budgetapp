import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createUser,
  getUserByUsername,
  User,
} from '../../../../database/users';
import { secureCookieOptions } from '../../../../util/cookies';
import { cookies } from 'next/headers';
import { createSession } from '../../../../database/sessions';

type Error = {
  error: string;
};

export type RegisterResponseBodyPost =
  | {
      user: User;
    }
  | Error;

// to validate the user data
const userSchema = z.object({
  email: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  // reInsertPassword: z.string().min(1),
});

export async function POST(
  request: NextRequest,
): Promise<NextResponse<RegisterResponseBodyPost>> {
  const body = await request.json();

  // 1. get credentials from the body

  const result = userSchema.safeParse(body);

  // 2. verify the user data and check that the name is not taken
  if (!result.success) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'either email, username or password missing',
      },
      // bad response
      { status: 400 },
    );
  }

  if (await getUserByUsername(result.data.username)) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'username is already used',
      },
      // bad response
      { status: 406 },
    );
  }

  // 3. hash the password
  const passwordHash = await bcrypt.hash(result.data.password, 10);

  // 4. store the credentials in the db

  const newUser = await createUser(
    result.data.email,
    result.data.username,
    passwordHash,
  );

  if (newUser?.error) {
    return NextResponse.json(
      {
        error: newUser?.error,
      },

      { status: 400 },
    );
  }

  if (!newUser) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'Error creating the new user',
      },

      { status: 400 },
    );
  }

  //when the user is created

  // 5. now we Create a token
  // crypto.randomBytes - creates strong random data
  const token = crypto.randomBytes(100).toString('base64');

  // 6. Create the session record with token and userid
  const session = await createSession(token, newUser.id);

  if (!session) {
    return NextResponse.json(
      {
        error: 'Error creating the new session',
      },
      { status: 500 },
    );
  }

  // 7. Send the new cookie in the headers
  //  we use cookies().set,
  // then we pass maxAge property to cookies to destroy itself
  cookies().set({
    name: 'sessionToken',
    value: session.token,
    ...secureCookieOptions,
  });

  // 8. return the new user to the client
  return NextResponse.json({ user: newUser });
}
