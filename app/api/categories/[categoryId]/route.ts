import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getValidSessionByToken } from '../../../../database/sessions';
import {
    updateCategoryById
} from '../../../../database/categories';
import { Error } from '../route';
import { Category } from '../../../Models/Category';

// we need to pass an id, get from the URL

// params - in addition to the request in a dynamic
// route like animal ID you receive params and it's very similar to a page route
// so the name of the params of the property it matches the name of the file

// so /animals/id  you can get const animalId transform into

// number because everything that is coming from the ID from the URL is a string, so

// Number(params.animalId) remember this animalId

// is coming from the name of the file

type TransactionResponseBodyPut = { category: Category } | Error;

const transactionSchema = z.object({
  name: z.string(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> },
): Promise<NextResponse<TransactionResponseBodyPut>> {
  console.log('PUT');
  const categoryId = Number(params.categoryId);
  const sessionTokenCookie = cookies().get('sessionToken');
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

  if (!categoryId) {
    return NextResponse.json(
      {
        error: 'transaction Id is not valid',
      },
      { status: 400 },
    );
  }
  body.date = new Date(body.date);
  body.amount = parseInt(body.amount);
  // zod please verify the body matches my schema
  const result = transactionSchema.safeParse(body);
  console.log(body, result);
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
  const category = await updateCategoryById(
    categoryId,
    result.data.name,
  );

  if (!category) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'transaction not found',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    category: category,
  });
}
