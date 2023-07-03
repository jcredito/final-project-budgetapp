import { notFound } from 'next/navigation';
import {
  getTransactionList,
  getTransactionsForUser,
} from '../../../database/transactions';
import { getUserByUsername } from '../../../database/users';
import TransactionsForm from '../../Components/TransactionsForm';
import styles from './page.module.scss';

type Props = {
  params: { username: string; date: string };
};
export default async function ProfileUsernamePage({ params }: Props) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  const transactions = await getTransactionsForUser(user.id);

  const transactionList = await getTransactionList();
  console.log('check', transactionList);
  return (
    <div>
      <div>id: {user.id}</div>
      <div>username: {user.username}</div>
      <TransactionsForm userId={user.id} transactions={transactions} />
    </div>
  );
}
// here I can also add if I want to put profile image, or something I want to show to the public
// it's possible to have a user with a huge object(table in db)
