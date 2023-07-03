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

export const getTransactionList = cache(async () => {
  const transactions = await sql<Transaction[]>`
    SELECT
      *
    FROM
    transactions
  `;
  return transactions;
});

export const getTransactionById = cache(async (id: number) => {
  const [transaction] = await sql<Transaction[]>`
    SELECT
      *
    FROM
      transactions
    WHERE
      id = ${id}
  `;
  return transaction;
});

export const deleteTransactionById = cache(async (id: number) => {
  const [transaction] = await sql<Transaction[]>`
    DELETE FROM
    transactions
    WHERE
      id = ${id}
    RETURNING *
  `;
  return transaction;
});

export const createTransaction = cache(
  async (
    date: string,
    userId: number,
    amount: number,
    category: string,
    type: string,
    note: string | null,
  ) => {
    const [transaction] = await sql<Transaction[]>`
  INSERT INTO transactions
  (date, user_id, amount, category, type, note)
  VALUES (${date}, ${userId}, ${amount},  ${category}, ${type}, ${note})
  RETURNING *
  `;

    return transaction;
  },
);

export const updateTransactionById = cache(
  async (
    id: number,
    date: string,
    userId: number,
    amount: number,
    category: string,
    type: string,
    note?: string,
  ) => {
    const [transaction] = await sql<Transaction[]>`
      UPDATE transactions
      SET
       date = ${date},
       user_id = ${userId},
       amount = ${amount},
       category = ${category},
       type = ${type},
       note = ${note || null}
      WHERE
        id = ${id}
        RETURNING *
    `;

    return transaction;
  },
);
