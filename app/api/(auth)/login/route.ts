import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getUserWithPasswordHashByUsername,
  User,
} from '../../../../database/users';
import { createSession } from '../../../../database/sessions';
import { cookies } from 'next/headers';
import { secureCookieOptions } from '../../../../util/cookies';

type Error = {
  error: string;
};

export type LoginResponseBodyPost =
  | {
      user: User;
    }
  | Error;

// to validate the user data
const userSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  // reInsertPassword: z.string().min(1),
});

export async function POST(
  request: NextRequest,
): Promise<NextResponse<LoginResponseBodyPost>> {
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

  // 3. verify the user's credentials
  const userWithPasswordHash = await getUserWithPasswordHashByUsername(
    result.data.username,
  );

  // if UserWithPasswordHash is undefine
  if (!userWithPasswordHash) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'user or password not valid',
      },

      { status: 401 },
    );
  }

  // 3. hash the password
  const isPasswordValid = await bcrypt.compare(
    result.data.password,
    userWithPasswordHash.passwordHash,
  );

  if (!isPasswordValid) {
    return NextResponse.json(
      {
        error: 'user or password not valid',
      },
      { status: 401 },
    );
  }
  // done with credentials verification
  // We are sure the user is authenticated

  // 4. now we Create a token
  // crypto.randomBytes - creates strong random data
  const token = crypto.randomBytes(100).toString('base64');

  // 5. Create the session record with token and userid
  const session = await createSession(token, userWithPasswordHash.id);

  if (!session) {
    return NextResponse.json(
      {
        error: 'Error creating the new session',
      },
      { status: 500 },
    );
  }

  // 6. Send the new cookie in the headers
  //  we use cookies().set,
  // then we pass maxAge property to cookies to destroy itself
  cookies().set({
    name: 'sessionToken',
    value: session.token,
    ...secureCookieOptions,
  });

  return NextResponse.json(
    {
      user: {
        username: userWithPasswordHash.username,
        id: userWithPasswordHash.id,
      },
    },
    {
      status: 200,
    },
  );
}
