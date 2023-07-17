import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  deleteBudgetById,
  updateBudgetById,
} from '../../../../database/budgets';
import { getValidSessionByToken } from '../../../../database/sessions';
import { Budget } from '../../../Models/Budget';
import { Error } from '../route';

// we need to pass an id, get from the URL

// params - in addition to the request in a dynamic
// route like animal ID you receive params and it's very similar to a page route
// so the name of the params of the property it matches the name of the file

// so /animals/id  you can get const animalId transform into

// number because everything that is coming from the ID from the URL is a string, so

// Number(params.animalId) remember this animalId

// is coming from the name of the file

type BudgetResponseBodyPut = { budget: Budget } | Error;
type BudgetResponseBodyDelete = { budget: Budget } | Error;

const transactionSchema = z.object({
  amount: z.number(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> },
): Promise<NextResponse<BudgetResponseBodyPut>> {
  console.log('PUT');
  const budgetId = Number(params.budgetId);
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

  const body = await request.json();

  if (!budgetId) {
    return NextResponse.json(
      {
        error: 'transaction Id is not valid',
      },
      { status: 400 },
    );
  }
  body.date = new Date(body.date);
  body.amount = parseFloat(body.amount);
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
  const budget = await updateBudgetById(budgetId, result.data.amount);

  if (!budget) {
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
    budget: budget,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> },
): Promise<NextResponse<BudgetResponseBodyDelete>> {
  const transactionId = Number(params.budgetId);

  // this prevent passing a not number
  if (!transactionId) {
    return NextResponse.json(
      {
        error: 'transaction Id is not valid',
      },
      { status: 400 },
    );
  }

  const budget = await deleteBudgetById(transactionId);

  if (!budget) {
    return NextResponse.json(
      {
        error: 'transaction Not Found',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ budget: budget });
}
