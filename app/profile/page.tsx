import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TransactionsForm from '../(auth)/transactions/TransactionsForm';
import { getValidSessionByToken } from '../../database/sessions';
import { getTransactionsForUser } from '../../database/transactions';
import { getUserBySessionToken } from '../../database/users';
// import styles from './page.module.scss';

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

  return (
    <div className="">
      {/* <div className="">id: {user.id}</div>
      <div>username: {user.username}</div> */}
      <div className="">
        <TransactionsForm userId={user.id} transactions={transactions} />
      </div>
    </div>
  );
}
// here I can also add if I want to put profile image, or something I want to show to the public
// it's possible to have a user with a huge object(table in db)
