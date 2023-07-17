import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createBudget } from '../../../database/budgets';
import { getValidSessionByToken } from '../../../database/sessions';
import { Budget } from '../../Models/Budget';
import { Category } from '../../Models/Category';

export type Error = {
  error: string;
};

type BudgetResponseBodyPost = { budget: Budget } | Error;

const transactionSchema = z.object({
  amount: z.number(),
  category_id: z.number(),
});

export async function POST(
  request: NextRequest,
): Promise<NextResponse<BudgetResponseBodyPost>> {
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

  const budget = await createBudget(
    session.userId,
    result.data.amount,
    result.data.category_id,
  );

  if (!budget) {
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
    budget: budget,
  });
}
