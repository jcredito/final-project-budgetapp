'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Category } from '../../Models/Category';
import { Transaction, TransactionTable } from '../../Models/Transaction';
import CategoryManagementCreate from '../categoryManagement/CategoryManagementCreate';
import TransactionItem from './TransactionItem';
import TransactionItemCreate from './TransactionItemCreate';
import styles from './TransactionList.module.css';

type Props = {
  transactions: Transaction[];
  categories: Category[];
  userId: number;
  setProfileTransactions: Dispatch<SetStateAction<Transaction[]>>;
};

export default function TransactionList({
  userId,
  transactions,
  categories,
  setProfileTransactions,
}: Props) {
  const [transactionList, setTransactionList] = useState(transactions);
  const transactionHeaders: string[] = [
    // 'Date', 'Amount', 'Category', 'Type', 'Note', '', ''
    'Date',
    'Amount',
    'Category',
    'Note',
    '',
    '',
  ];
  const [creatingTransaction, setCreatingTransaction] =
    useState<boolean>(false);
  async function deleteTransaction(transaction: Transaction) {
    if (transaction.id) {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      setTransactionList(
        transactionList.filter(
          (currentTransaction) => currentTransaction.id !== data.transaction.id,
        ),
      );
      setProfileTransactions(
        transactionList.filter(
          (currentTransaction) => currentTransaction.id !== data.transaction.id,
        ),
      );
    }
  }

  async function createTransaction(transaction: TransactionTable) {
    console.log(transaction);
    const response = await fetch('/api/transactions', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        date: transaction.date,
        amount: transaction.amount,
        category_id: transaction.categoryId,
        type: transaction.type,
        note: transaction.note,
      }),
    });
    const data = await response.json();
    data.transaction.date = new Date(data.transaction.date);
    setTransactionList([...transactionList, data.transaction]);
    setProfileTransactions([...transactionList, data.transaction]);
    setCreatingTransaction(false);
  }

  async function updateTransaction(transaction: TransactionTable) {
    if (transaction.id) {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          userId,
          date: transaction.date,
          amount: transaction.amount,
          category: transaction.categoryId,
          type: transaction.type,
          note: transaction.note,
        }),
      });
      const data = await response.json();
      setProfileTransactions(
        transactionList.map((t) => {
          if (t.id === data.transaction.id) {
            return data.transaction;
          }
          return t;
        }),
      );
      setTransactionList(
        transactionList.map((t) => {
          if (t.id === data.transaction.id) {
            return data.transaction;
          }
          return t;
        }),
      );
    }
  }

  return (
    <div className="m-50 px-28 bg-gray-200 py-2">
      <div className={styles['container-create']}>
        {!creatingTransaction && (
          <div className="px-4 flex flex-row-reverse">
            <button
              className={styles['btn-create']}
              onClick={() => {
                setCreatingTransaction(true);
              }}
            >
              Create Transaction
            </button>
          </div>
        )}
        {creatingTransaction && (
          <div className="bg-white px-4">
            <div className="border-b-2 py-2">
              <h3 className="font-bold">New Transaction</h3>
            </div>
            <TransactionItemCreate
              createTransaction={createTransaction}
              categories={categories}
              setCreatingTransaction={setCreatingTransaction}
            />
          </div>
        )}
      </div>
      {transactionList.length > 0 && (
        <div>
          <div className="border-b-2 py-2 mb-2 px-4 bg-white">
            <h3 className="font-bold">Transaction List</h3>
          </div>
          <table className={styles['table']}>
            <thead>
              <tr>
                {transactionHeaders.map((title, index) => {
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
              {transactionList.map((transaction) => {
                return (
                  <TransactionItem
                    transaction={transaction}
                    updateTransaction={updateTransaction}
                    deleteTransaction={deleteTransaction}
                    categories={categories}
                    key={`transaction-item-${transaction.id}`}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {transactionList.length === 0 && (
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
