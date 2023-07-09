import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getValidSessionByToken } from '../../../database/sessions';
import {
  createCategory
} from '../../../database/categories';
import { Category } from '../../Models/Category';

export type Error = {
  error: string;
};

type CategoryResponseBodyPost = { category: Category } | Error;

const transactionSchema = z.object({
  name: z.string(),
  userId: z.number(),
});

export async function POST(
  request: NextRequest,
): Promise<NextResponse<CategoryResponseBodyPost>> {
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. check if the token has a valid session
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  if (!session) {
    return NextResponse.json(
      {
        error: 'session token is not valid',
      },
      { status: 401 },
    );
  }
  //@TODO handle empty body
  const body = await request.json();
  // zod please verify the body matches my schema
  const result = transactionSchema.safeParse(body);

  if (!result.success) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'The data is incomplete',
      },
      { status: 400 },
    );
  }
  // console.log('session', session, result.data);
  // query the database to get all the transactions
  const category = await createCategory(
    session.userId,
    result.data.name
  );

  if (!category) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'Error creating the new transaction',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    category: category,
  });
}
