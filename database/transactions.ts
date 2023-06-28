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

export const createTransaction = cache(async (transaction: Transaction) => {
  const [newTransaction] = await sql<Transaction[]>`
  INSERT INTO transactions
  (category_id, user_id, amount, note, type)
  VALUES
  (${transaction.categoryId}, ${transaction.userId}, ${transaction.amount}, ${transaction.note}, ${transaction.type})
  `;
  return newTransaction;
});
