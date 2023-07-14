'use client';

import { useEffect, useState } from 'react';
import { Budget } from '../Models/Budget';
import { Category } from '../Models/Category';
import { Transaction, TransactionGroup } from '../Models/Transaction';
import BudgetManagement from './BudgetManagement/BudgetManagement';
import CategoryManagement from './CategoryManagement/CategoryManagement';
import TransactionList from './TransactionList/TransactionList';

type Props = {
  userId: number;
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
};

export default function Profile({
  userId,
  categories,
  transactions,
  budgets,
}: Props) {
  const [profileCategories, setProfileCategories] =
    useState<Category[]>(categories);
  const [profileTransactions, setProfileTransactions] =
    useState<Transaction[]>(transactions);
  const [profileBudgets, setProfileBudgets] = useState<Budget[]>(budgets);
  const [profileTransactionGroups, setProfileTransactionGroups] = useState<
    TransactionGroup[]
  >(
    categories.map((cat) => {
      return {
        category: cat,
        amount: transactions
          .filter((t) => {
            if (t.category.id === cat.id) return t;
          })
          .reduce((tot, tran) => tot + tran.amount * 1, 0),
      };
    }),
  );
  async function refreshCategories(refreshedCategories: Category[]) {
    setProfileCategories(refreshedCategories);
  }
  useEffect(() => {
    const updatedTransactions = profileTransactions.map((transaction) => {
      const category =
        profileCategories.find((c) => c.id === transaction.category.id) ??
        transaction.category;
      transaction.category = category;
      return transaction;
    });
    const updatedBudgets = profileBudgets.map((budget) => {
      const category =
        profileCategories.find((c) => c.id === budget.category.id) ??
        budget.category;
      budget.category = category;
      return budget;
    });
    setProfileBudgets(updatedBudgets);
    setProfileTransactions(updatedTransactions);
  }, [profileCategories]);
  useEffect(() => {
    const transactionGroups = profileCategories.map((cat) => {
      return {
        category: cat,
        amount: profileTransactions
          .filter((t) => {
            if (t.category.id === cat.id) return t;
          })
          .reduce((tot, tran) => tot + tran.amount * 1, 0),
      };
    });
    setProfileTransactionGroups(transactionGroups);
  }, [profileTransactions]);
  return (
    <>
      <BudgetManagement
        userId={userId}
        categories={profileCategories}
        budgets={profileBudgets}
        transactionGroups={profileTransactionGroups}
        setProfileBudgets={setProfileBudgets}
      />
      <CategoryManagement
        userId={userId}
        categories={profileCategories}
        refreshCategories={refreshCategories}
      />
      <TransactionList
        userId={userId}
        transactions={profileTransactions}
        categories={profileCategories}
        setProfileTransactions={setProfileTransactions}
      />
    </>
  );
}
