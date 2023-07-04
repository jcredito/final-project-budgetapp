import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import TransactionsForm from '../(auth)/transactions/TransactionsForm';
import { getValidSessionByToken } from '../../database/sessions';
import {
  getTransactionList,
  getTransactionsForUser,
} from '../../database/transactions';
import { getUserBySessionToken, getUserByUsername } from '../../database/users';
import styles from './page.module.scss';

type Props = {
  params: { username: string; date: string };
};
export default async function ProfileUsernamePage() {
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. check if the sessionToken has a valid session

  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  const user = session && (await getUserBySessionToken(session.token));
  // 3. Either redirect or render the login form
  if (!user) redirect('/login?returnTo=/profile');

  const transactions = await getTransactionsForUser(user.id);

  const transactionList = await getTransactionList();
  // console.log('check', transactionList);
  return (
    <div>
      <div className='bg'>id: {user.id}</div>
      <div>username: {user.username}</div>
      <TransactionsForm userId={user.id} transactions={transactions} />
    </div>
  );
}
// here I can also add if I want to put profile image, or something I want to show to the public
// it's possible to have a user with a huge object(table in db)
