'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Budget, BudgetTable } from '../../Models/Budget';
import { Category } from '../../Models/Category';
import { TransactionGroup } from '../../Models/Transaction';
import styles from './BudgetManagement.module.css';
import BudgetManagementEdit from './BudgetManagementEdit';
import BudgetManagementItem from './BudgetManagementItem';

type Props = {
  categories: Category[];
  userId: number;
  budgets: Budget[];
  transactionGroups: TransactionGroup[];
  setProfileBudgets: Dispatch<SetStateAction<Budget[]>>;
};

export default function BudgetManagement({
  userId,
  categories,
  budgets,
  transactionGroups,
  setProfileBudgets,
}: Props) {
  const budgetHeaders: string[] = [
    'Category',
    'Budget',
    'Transactions',
    'Balance',
    '',
    '',
  ];
  const [managedBudgets, setManageBudget] = useState<Budget[]>(budgets);
  const [creatingBudget, setCreatingBudget] = useState<boolean>(false);
  const [newBudget, setNewBudget] = useState<number>(0);
  const [tempNewBudget, setTempNewBudget] = useState<string>('0');
  const [category, setCategory] = useState<number>(categories[0]?.id ?? 0);
  async function updateBudget(budget: BudgetTable) {
    if (budget.id) {
      const response = await fetch(`/api/budgets/${budget.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          amount: budget.amount,
        }),
      });
      const data = await response.json();
      setProfileBudgets(
        budgets.map((b) => {
          if (b.id === data.budget.id) {
            b.amount = data.budget.amount;
          }
          return b;
        }),
      );
    }
  }
  async function createBudget(budget: BudgetTable) {
    const response = await fetch(`/api/budgets`, {
      method: 'POST',
      body: JSON.stringify({
        userId: budget.userId,
        amount: budget.amount,
        category_id: budget.categoryId,
      }),
    });
    const data = await response.json();
    setProfileBudgets([...budgets, data.budget]);
  }
  async function deleteBudget(budget: BudgetTable) {
    if (budget.id) {
      const response = await fetch(`/api/budgets/${budget.id}`, {
        method: 'DELETE',
        body: JSON.stringify({}),
      });
      const data = await response.json();
      setProfileBudgets(budgets.filter((b) => b.id !== budget.id));
    }
  }
  useEffect(() => {
    setManageBudget(budgets);
    if (
      categories.filter((c) => !budgets.find((b) => b.category.id === c.id))
        .length > 0
    ) {
      setCategory(
        categories.filter(
          (c) => !budgets.find((b) => b.category.id === c.id),
        )[0]?.id ?? 0,
      );
    }
  }, [budgets]);
  return (
    <div className="m-50 px-28 bg-gray-200 py-2">
      <div className="border-b-2 py-2 mb-2 px-4 bg-white">
        <h3 className="font-bold">Budget Management</h3>
      </div>
      {!creatingBudget && (
        <div className="py-4 px-4 flex flex-row-reverse">
          <button
            className={styles['btn-create']}
            onClick={() => {
              setCreatingBudget(true);
            }}
          >
            Create budget
          </button>
        </div>
      )}
      {creatingBudget && (
        <div className="py-2 bg-white px-4 mb-2">
          <div className="py-2 border-b-2 mb-4">
            <h3 className="font-bold">New budget</h3>
          </div>
          {categories.filter(
            (c) => !budgets.find((b) => b.category.id === c.id),
          ).length > 0 ? (
            <form
              onSubmit={(event) => event.preventDefault()}
              className="flex flex-row w-full"
            >
              <div className="flex flex-wrap grow">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <select
                    className="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    value={category}
                    onChange={(event) =>
                      setCategory(parseInt(event.currentTarget.value))
                    }
                  >
                    {categories
                      .filter(
                        (c) => !budgets.find((b) => b.category.id === c.id),
                      )
                      .map((option) => {
                        return (
                          <option
                            value={option.id}
                            key={`option-id-${option.id}`}
                          >
                            {option.name}
                          </option>
                        );
                      })}
                  </select>
                  <p className="text-gray-600 text-xs">Category</p>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <input
                    className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    value={tempNewBudget}
                    onChange={(event) => {
                      setTempNewBudget(event.currentTarget.value);
                    }}
                    onBlur={(event) => {
                      if (tempNewBudget.match(/^\d{1,}(\.\d{0,4})?$/)) {
                        setNewBudget(parseFloat(tempNewBudget));
                      } else {
                        setTempNewBudget(newBudget.toFixed(2));
                      }
                    }}
                  />
                  <p className="text-gray-600 text-xs">Amount</p>
                </div>
              </div>
              <div className="flex flex-wrap pb-1 mx-3">
                <div className="w-full flex gap-x-1">
                  <button
                    className={`${styles['btn-save']} max-h-12`}
                    onClick={async () => {
                      createBudget({
                        id: undefined,
                        amount: newBudget,
                        userId: userId,
                        categoryId: category,
                      });
                      setCreatingBudget(false);
                      setNewBudget(0);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className={`${styles['btn-cancel']} max-h-12`}
                    onClick={() => {
                      setCreatingBudget(false);
                      setNewBudget(0);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div>
              <h3>No category available. Please create a new one.</h3>
              <button
                className={`${styles['btn-cancel']} max-h-12`}
                onClick={() => {
                  setCreatingBudget(false);
                  setNewBudget(0);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
      {managedBudgets.length > 0 && (
        <div>
          <table className={styles['table']}>
            <thead>
              <tr>
                {budgetHeaders.map((title, index) => {
                  return (
                    <th
                      className={styles['table-title']}
                      key={`title-${index}-${title}`}
                    >
                      {title}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className={styles['table-body']}>
              {managedBudgets.map((budget) => {
                return (
                  <BudgetManagementItem
                    budget={budget}
                    transactionGroup={transactionGroups.find(
                      (b) => b.category.id === budget.category.id,
                    )}
                    updateBudget={updateBudget}
                    deleteBudget={deleteBudget}
                    key={`budget-${budget.id}`}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {managedBudgets.length === 0 && (
        <div className="flex items-center justify-center">
          <Image
            src={'/images/empty-folder.png'}
            width={250}
            height={250}
            alt="Empty"
          />
        </div>
      )}
    </div>
  );
}
