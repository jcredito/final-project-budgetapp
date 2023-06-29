import { notFound } from 'next/navigation';
import { getTransactionsForUser } from '../../../database/transactions';
import { getUserByUsername } from '../../../database/users';
import TransactionsForm from '../../Components/TransactionsForm';
import styles from './page.module.scss';

type Props = {
  params: { username: string };
};
export default async function ProfileUsernamePage({ params }: Props) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  const transactions = await getTransactionsForUser(user.id);
  return (
    <div>
      {transactions.map((transaction) => {
        return (
          <div>
            <div>id: {user.id}</div>
            <div>username: {user.username}</div>

            <TransactionsForm userId={user.id} />
            {/* <div className={styles.transactionsList}>Transactions List</div>
             */}
            <div
              key={`transaction-div-${transaction.id}`}
              data-test-id={`transaction-type-${transaction.type}`}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
// here I can also add if I want to put profile image, or something I want to show to the public
// it's possible to have a user with a huge object(table in db)
