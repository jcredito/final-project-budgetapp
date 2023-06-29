import { cache } from 'react';
import { Transaction } from '../migrations/1687801828-createTableTransactions';
import { sql } from './connect';

// list of transactions
export const getTransactionsForUser = cache(async (user_id: number) => {
  const transactions = await sql<Transaction[]>`
  SELECT * FROM
  transactions
  WHERE
  transactions.user_id = ${user_id}
  `;

  return transactions;
});
// export const getTransactionlById = cache(async (id: number) => {
//   const [transaction] = await sql<Transaction[]>`
//     SELECT
//       *
//     FROM
//     transactions
//     WHERE
//       id = ${id}
//   `;
//   return transaction;
// });

export const createTransaction = cache(
  async (
    date: string,
    userId: number,
    amount: number,
    note: string,
    type: string,
    categoryId: string | null,
  ) => {
    const [newTransaction] = await sql<Transaction[]>`
  INSERT INTO transactions
  (date, category_id, user_id, amount, note, type)
  VALUES (${date}, ${categoryId}, ${userId}, ${amount}, ${note}, ${type})
  RETURNING *
  `;

    return newTransaction;
  },
);
