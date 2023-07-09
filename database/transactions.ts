import { cache } from 'react';
import { Transaction, TransactionTable } from '../app/Models/Transaction';
import { Category } from '../app/Models/Category';
import { sql } from './connect';

// list of transactions
export const getTransactionsForUser = cache(async (user_id: number) => {
  const transactionsTable = await sql<TransactionTable[]>`
  SELECT
  t."id",
  t."date",
  t."user_id",
  t."amount",
  t."category_id",
  t."type",
  t."note"
FROM
transactions t, categories c
WHERE t."category_id" = c."id"
AND  t."user_id" = ${user_id}
  `;
  const categories = await sql<Category[]>`
  SELECT
  *
FROM
categories c
WHERE c."user_id" = ${user_id}
  `;
  const transactions: Transaction[] = transactionsTable.map(transactionTable => {
    return {
      id: transactionTable.id,
      date: transactionTable.date,
      userId: transactionTable.userId,
      amount: transactionTable.amount,
      category: {
        id: transactionTable.categoryId,
        userId: transactionTable.userId,
        name: categories.find(category => category.id === transactionTable.categoryId)?.name ?? ''
      },
      type: transactionTable.type,
      note: transactionTable.note
    }
  });
  return transactions;
});

export const getTransactionList = cache(async () => {
  const transactions = await sql<Transaction[]>`
    SELECT
    t."id",
    t."date",
    t."user_id",
    t."amount",
    c."name" as category.id,
    t."type",
    t."note"
    FROM
    transactions t, categories c
    WHERE t."category" = c."id"
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
    date: Date,
    userId: number,
    amount: number,
    category_id: number,
    type: string,
    note: string | null,
  ) => {
    const [transactionTable] = await sql<TransactionTable[]>`
  INSERT INTO transactions
  (date, user_id, amount, category_id, type, note)
  VALUES (${date}, ${userId}, ${amount},  ${category_id}, ${type}, ${note})
  RETURNING *
  `;
  const [newcategory] = await sql<Category[]>`
  SELECT
  *
FROM
categories c
WHERE c."id" = ${category_id}
  `;

  if (!transactionTable || !newcategory) {
    return null;
  }
    return {
      id: transactionTable.id,
      date: transactionTable.date,
      userId: transactionTable.userId,
      amount: transactionTable.amount,
      category: newcategory,
      type: transactionTable.type,
      note: transactionTable.note
    };
  },
);

export const updateTransactionById = cache(
  async (
    id: number,
    userId: number,
    date: Date,
    amount: number,
    category: number,
    type: string,
    note?: string,
  ) => {
    console.log('params updateTransactionById::', date, userId);
    const [transactionTable] = await sql<TransactionTable[]>`
      UPDATE transactions
      SET
       user_id = ${userId},
       date = ${date},
       amount = ${amount},
       category_id = ${category},
       type = ${type},
       note = ${note || null}
      WHERE
        id = ${id}
        RETURNING *
    `;
    const [newcategory] = await sql<Category[]>`
    SELECT
    *
  FROM
  categories c
  WHERE c."id" = ${category}
    `;

    if (!transactionTable || !newcategory) {
      return null;
    }

    return {
      id: transactionTable.id,
      date: transactionTable.date,
      userId: transactionTable.userId,
      amount: transactionTable.amount,
      category: newcategory,
      type: transactionTable.type,
      note: transactionTable.note
    };
  },
);
