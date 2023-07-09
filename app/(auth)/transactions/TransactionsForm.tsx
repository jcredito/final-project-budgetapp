'use client';

import moment from 'moment';
import { useState } from 'react';
import { Transaction } from '../../../migrations/1687801828-createTableTransactions';
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
    <div className="m-50 flex justify-center px-40">
      <div className="">
        <h1 className="mb-10 flex justify-center "> New Transaction </h1>

        <form
          className="flex bg-indigo-500 space-x-20 p-4 rounded-lg"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="font-bold">
            Date
            <input
              className="flex border-gray-500 rounded-lg
               bg-indigo-200 w-32"
              type="date"
              value={transactionDate}
              onChange={(event) => {
                setTransactionDate(event.currentTarget.value);
              }}
            />
          </label>
          <label className="font-bold">
            Amount
            <input
              type="number"
              className="flex border-gray-500 rounded-lg
             bg-indigo-200 w-32"
              value={amountInput}
              onChange={(event) => {
                setAmountInput(parseInt(event.currentTarget.value));
              }}
            />
          </label>

          <label className="font-bold">
            Category
            <input
              type="text"
              className="flex border-gray-500 rounded-lg
             bg-indigo-200 w-32"
              value={categoryInput}
              onChange={(event) => {
                setCategoryInput(event.currentTarget.value);
              }}
            />
          </label>

          <label className="font-bold">
            Type
            <input
              type="text"
              className="flex border-gray-500 rounded-lg
              bg-indigo-200 w-32"
              value={typeInput}
              onChange={(event) => {
                setTypeInput(event.currentTarget.value);
              }}
            />
          </label>

          <label className="font-bold">
            Note
            <input
              type="text"
              className="flex border-gray-500 rounded-lg
              bg-indigo-200 w-32"
              value={noteInput}
              onChange={(event) => {
                setNoteInput(event.currentTarget.value);
              }}
            />
          </label>

          <label>
          <br />
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => await createTransaction()}
          >
            add
          </button>
          </label>
        </form>
        {/* *****OUTPUT***** */}

          <h2 className="m-5 flex justify-center">Transaction List</h2>
          { transactionList === undefined || transactionList.length === 0 ? (
            <h3> Enter your first transaction </h3>
          ) : (
            transactionList.map((transaction) => {
              const transactionId: number = transaction.id ?? 0;
              console.log('TRANSACTION!!!', transaction);
              return (
                  <form
                    className="flex bg-indigo-500 space-x-20 p-4 rounded-lg"
                    onSubmit={(event) => event.preventDefault()}
                    key={`transaction-inputs-${transaction.id}`}
                    data-test-id="transaction"
                  >
                    <label className=''>
                    <br />
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
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={async () =>
                        await deleteTransactionById(transactionId)
                      }
                    >
                      x
                    </button>
                  </form>
              );
            })
          )}
      </div>
    </div>
  );
}
