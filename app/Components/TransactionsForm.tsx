'use client';

import { useState } from 'react';
// import { getUserBySessionToken } from '../../database/users';
// import { Transaction } from '../../migrations/1687801828-createTableTransactions';
import styles from './TransactionsForm.module.scss';

type Props = {
  // transactions: Transaction[];
  userId: number;
};

export default function TransactionsForm({ userId }: Props) {
  //  const [transactionList, setTransactionList] = useState(transactions);
  const [transactionDate, setTransactionDate] = useState(Date());
  const [amountInput, setAmountInput] = useState(0);
  const [noteInput, setNoteInput] = useState('');
  const [typeInput, setTypeInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  async function createTransaction() {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      body: JSON.stringify({
        date: transactionDate,
        userId,
        amount: amountInput,
        note: noteInput,
        type: typeInput,
        categoryId: categoryInput,
      }),
    });
    const data = await response.json();
    console.log(data);
    // setTransactionList([...transactionList, data.transaction]);
  }

  return (
    <div className={styles.box}>
      Transactions
      <form
        onSubmit={(event) => event.preventDefault()}
        className={styles.form}
      >
        <label>
          <input
            type="date"
            value={transactionDate}
            onChange={(event) => setTransactionDate(event.currentTarget.value)}
          />
          Date
        </label>
        <br />
        <label>
          <input
            value={amountInput}
            onChange={(event) =>
              setAmountInput(parseInt(event.currentTarget.value))
            }
          />
          Amount
        </label>
        <br />
        <label>
          <input
            value={noteInput}
            onChange={(event) => setNoteInput(event.currentTarget.value)}
          />
          Note
        </label>
        <br />
        <label>
          <input
            value={typeInput}
            onChange={(event) => setTypeInput(event.currentTarget.value)}
          />
          Type
        </label>
        <br />
        <label>
          <input
            value={categoryInput}
            onChange={(event) => setCategoryInput(event.currentTarget.value)}
          />
          Category
        </label>
        <button onClick={async () => await createTransaction()}>add</button>
      </form>
    </div>
  );
}
