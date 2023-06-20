import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createUser,
  getUserByUsername,
  User,
} from '../../../../database/users';

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
        error: 'username or password missing',
      },
      // bad response
      { status: 400 },
    );
  }

  const user = await getUserByUsername(result.data.username);

  // if (await getUserByUsername(result.data.username)) {
  //   // zod send you details about the error
  //   // console.log(result.error);
  //   return NextResponse.json(
  //     {
  //       error: 'username is already used',
  //     },
  //     // bad response
  //     { status: 406 },
  //   );
  // }
  // 3. hash the password
  // 4. store the credentials in the db

  // const newUser = await createUser(
  //   result.data.email,
  //   result.data.username,
  //   result.data.password,
  // );
  // console.log(newUser);
  return NextResponse.json({ user: { id: 1, username: 'jose' } });
}
