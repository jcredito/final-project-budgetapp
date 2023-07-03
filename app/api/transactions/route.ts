import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getValidSessionByToken } from '../../../database/sessions';
import {
  createTransaction,
  getTransactionsForUser,
} from '../../../database/transactions';
import { Transaction } from '../../../migrations/1687801828-createTableTransactions';

export type Error = {
  error: string;
};

type TransactionsResponseBodyGet = { transactions: Transaction } | Error;
type TransactionsResponseBodyPost = { transaction: Transaction } | Error;

const transactionSchema = z.object({
  date: z.string(),
  userId: z.number(),
  amount: z.number(),
  category: z.string(),
  type: z.string(),
  note: z.string().optional(),
});

export async function GET(
  request: NextRequest,
): Promise<NextResponse<TransactionsResponseBodyGet>> {
  // const { searchParams } = new URL(request.url);

  // 1. get the token from the cookie
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

  const transactions = await getTransactionsForUser(session.user_id);
  // console.log('check', transactions);

  return NextResponse.json({ transactions: transactions });
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<TransactionsResponseBodyPost>> {
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
  console.log(body);

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
  const transaction = await createTransaction(
    result.data.date,
    session.userId,
    result.data.amount,
    result.data.category,
    result.data.type,
    result.data.note || null,
  );

  if (!transaction) {
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
    transaction: transaction,
  });
}
