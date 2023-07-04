'use client';

import moment from 'moment';
import { useState } from 'react';
import { Transaction } from '../../migrations/1687801828-createTableTransactions';
// import { getUserBySessionToken } from '../../database/users';
// import { Transaction } from '../../migrations/1687801828-createTableTransactions';
import styles from './TransactionsForm.module.scss';

type Props = {
  transactions: Transaction[];
  userId: number;
};

export default function TransactionsForm({ userId, transactions }: Props) {
  const [transactionList, setTransactionList] = useState(transactions);
  const [transactionDate, setTransactionDate] = useState(Date());
  const [amountInput, setAmountInput] = useState(0);
  const [categoryInput, setCategoryInput] = useState('');
  const [typeInput, setTypeInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [onEditId, setOnEditId] = useState<number>();

  // only for edit inputs
  const [onEditTransactionDate, setOnEditTransactionDate] = useState(Date);
  const [onEditAmountInput, setOnEditAmountInput] = useState(0);
  const [onEditCategoryInput, setOnEditCategoryInput] = useState('');
  const [onEditTypeInput, setOnEditTypeInput] = useState('');
  const [onEditNoteInput, setOnEditNoteInput] = useState('');

  // Getting all transactions
  async function getTransactionList() {
    const response = await fetch('/api/transactions');
    const data = await response.json();
    setTransactionList([...transactionList, data.transaction]);
  }
  // JS way to do a POST
  async function createTransaction() {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        date: transactionDate,
        amount: amountInput,
        category: categoryInput,
        type: typeInput,
        note: noteInput,
      }),
    });
    const data = await response.json();
    setTransactionDate('');
    setAmountInput(0);
    setCategoryInput('');
    setTypeInput('');
    setNoteInput('');
    // 3 steps to update a State
    // 1  set it
    // 2 make a copy, use ...transactionList
    // 3 use an array for updating list
    data.transaction.date = new Date(data.transaction.date);
    setTransactionList([...transactionList, data.transaction]);
  }

  async function deleteTransactionById(id: number) {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    setTransactionList(
      transactionList.filter(
        (transaction) => transaction.id !== data.transaction.id,
      ),
    );
  }

  async function updateTransactionById(id: number) {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        userId,
        date: onEditTransactionDate,
        amount: onEditAmountInput,
        category: onEditCategoryInput,
        type: onEditTypeInput,
        note: onEditNoteInput,
      }),
    });

    const data = await response.json();
    data.transaction.date = new Date(data.transaction.date);
    setTransactionList(
      transactionList.map((transaction) => {
        if (transaction.id === data.transaction.id) {
          return data.transaction;
        }
        return transaction;
      }),
    );
  }

  return (
    <div className={styles.pageBox}>
      <div className={styles.formBox}>
        <h1> New Transaction </h1>

        <div className={styles.form}>
          <label>
            Date
            <input
              type="date"
              value={transactionDate}
              onChange={(event) => {
                setTransactionDate(event.currentTarget.value);
              }}
            />
          </label>
          <label>
            Amount
            <input
              value={amountInput}
              onChange={(event) => {
                setAmountInput(parseInt(event.currentTarget.value));
              }}
            />
          </label>

          <label>
            Category
            <input
              value={categoryInput}
              onChange={(event) => {
                setCategoryInput(event.currentTarget.value);
              }}
            />
          </label>

          <label>
            Type
            <input
              value={typeInput}
              onChange={(event) => {
                setTypeInput(event.currentTarget.value);
              }}
            />
          </label>

          <label>
            Note
            <input
              value={noteInput}
              onChange={(event) => {
                setNoteInput(event.currentTarget.value);
              }}
            />
          </label>

          <button onClick={async () => await createTransaction()}>add</button>
        </div>
        {/* *****OUTPUT***** */}
        <div className={styles.outputBox}>
          <h2> Transaction List</h2>
          {transactionList === undefined ? (
            <h3> Enter your first transaction </h3>
          ) : (
            transactionList.map((transaction) => {
              const transactionId: number = transaction.id ?? 0;
              console.log('TRANSACTION!!!', transaction);
              return (
                <div
                  className={styles.transactionBox}
                  key={`transaction-inputs-${transaction.id}`}
                  data-test-id="transaction"
                >
                  <label>
                    <input
                      value={
                        transaction.id !== onEditId
                          ? moment(transaction.date).format('YYYY-MM-DD')
                          : onEditTransactionDate
                      }
                      onChange={(event) =>
                        setOnEditTransactionDate(event.currentTarget.value)
                      }
                      disabled={transaction.id !== onEditId}
                    />
                    Date
                  </label>
                  <label>
                    <input
                      value={
                        transaction.id !== onEditId
                          ? transaction.amount
                          : onEditAmountInput
                      }
                      onChange={(event) =>
                        setOnEditAmountInput(
                          parseInt(event.currentTarget.value),
                        )
                      }
                      disabled={transaction.id !== onEditId}
                    />
                    Amount
                  </label>
                  <label>
                    <input
                      value={
                        transaction.id !== onEditId
                          ? transaction.category
                          : onEditCategoryInput
                      }
                      onChange={(event) =>
                        setOnEditCategoryInput(event.currentTarget.value)
                      }
                      disabled={transaction.id !== onEditId}
                    />
                    Category
                  </label>

                  <label>
                    <input
                      value={
                        transaction.id !== onEditId
                          ? transaction.type
                          : onEditTypeInput
                      }
                      onChange={(event) =>
                        setOnEditTypeInput(event.currentTarget.value)
                      }
                      disabled={transaction.id !== onEditId}
                    />
                    Type
                  </label>

                  <label>
                    <input
                      value={
                        transaction.id !== onEditId
                          ? transaction.note || ''
                          : onEditNoteInput
                      }
                      onChange={(event) =>
                        setOnEditNoteInput(event.currentTarget.value)
                      }
                      disabled={transaction.id !== onEditId}
                    />
                    Note
                  </label>
                  {transaction.id === onEditId ? (
                    <button
                      onClick={async () => {
                        setOnEditId(undefined);
                        await updateTransactionById(transactionId);
                      }}
                    >
                      save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setOnEditId(transaction.id);
                        setOnEditTransactionDate(transaction.date);
                        setOnEditAmountInput(transaction.amount);
                        setOnEditCategoryInput(transaction.category);
                        setOnEditTypeInput(transaction.type);
                        setOnEditNoteInput(transaction.note || '');
                      }}
                    >
                      edit
                    </button>
                  )}
                  <button
                    onClick={async () =>
                      await deleteTransactionById(transactionId)
                    }
                  >
                    x
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
