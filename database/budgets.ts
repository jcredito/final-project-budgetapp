import { cache } from 'react';
import { Transaction, TransactionTable } from '../app/Models/Transaction';
import { Category } from '../app/Models/Category';
import { sql } from './connect';
import { Budget, BudgetTable } from '../app/Models/Budget';

// list of transactions
export const getBudgetsForUser = cache(async (user_id: number) => {
  const budgetsTable = await sql<BudgetTable[]>`
  SELECT
  t."id",
  t."user_id",
  t."amount",
  t."category_id"
FROM
budgets t, categories c
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
  const budgets: Budget[] = budgetsTable.map(budgetTable => {
    return {
      id: budgetTable.id,
      userId: budgetTable.userId,
      amount: budgetTable.amount,
      category: {
        id: budgetTable.categoryId,
        userId: budgetTable.userId,
        name: categories.find(category => category.id === budgetTable.categoryId)?.name ?? ''
      }
    }
  });
  return budgets;
});



export const deleteBudgetById = cache(async (id: number) => {
  const [budget] = await sql<Budget[]>`
    DELETE FROM
    budget
    WHERE
      id = ${id}
    RETURNING *
  `;
  return budget;
});

export const createBudget = cache(
  async (
    userId: number,
    amount: number,
    category_id: number
  ) => {
    const [budgetTable] = await sql<BudgetTable[]>`
  INSERT INTO budgets
  (user_id, amount, category_id)
  VALUES (${userId}, ${amount},  ${category_id})
  RETURNING *
  `;
  const [newcategory] = await sql<Category[]>`
  SELECT
  *
FROM
categories c
WHERE c."id" = ${category_id}
  `;

  if (!budgetTable || !newcategory) {
    return null;
  }
    return {
      id: budgetTable.id,
      userId: budgetTable.userId,
      amount: budgetTable.amount,
      category: newcategory
    };
  },
);

export const updateBudgetById = cache(
  async (
    id: number,
    amount: number
  ) => {
    const [budgetTable] = await sql<BudgetTable[]>`
      UPDATE budgets
      SET
       amount = ${amount}
      WHERE
        id = ${id}
        RETURNING *
    `;
    if (!budgetTable) {
      return null;
    }
    const [newcategory] = await sql<Category[]>`
    SELECT
    *
  FROM
  categories c
  WHERE c."id" = ${budgetTable.categoryId}
    `;

    if (!newcategory) {
      return null;
    }

    return {
      id: budgetTable.id,
      userId: budgetTable.userId,
      amount: budgetTable.amount,
      category: newcategory
    };
  },
);
