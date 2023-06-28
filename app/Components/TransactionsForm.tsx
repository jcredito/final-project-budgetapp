'use client';

import { headers } from 'next/headers';
import { useState } from 'react';
import { createTransaction } from '../../database/transactions';
import styles from './TransactionsForm.module.scss';

export default function TransactionsForm() {
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');

  return (
    <div className={styles.box}>
      Transactions
      <form>
        <label>
          <input
            value={amount}
            onChange={(event) => setAmount(event.currentTarget.value)}
          />
          Amount
        </label>
        <br />
        <label>
          <input
            value={note}
            onChange={(event) => setNote(event.currentTarget.value)}
          />
          Note
        </label>
        <br />
        <label>
          <input
            value={category}
            onChange={(event) => setCategory(event.currentTarget.value)}
          />
          Category
        </label>
        <button onClick={async () => await createTransaction()}></button>
      </form>
    </div>
  );
}
