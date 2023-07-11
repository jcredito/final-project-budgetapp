import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TransactionsForm from '../(auth)/transactions/TransactionsForm';
import TransactionList from '../Components/transactionList/TransactionList';
import { getValidSessionByToken } from '../../database/sessions';
import { getTransactionsForUser } from '../../database/transactions';
import {getBudgetsForUser} from '../../database/budgets';
import { getUserBySessionToken } from '../../database/users';
import { getCategoriesForUser } from '../../database/categories';
import { Category } from '../Models/Category';
import CategoryManagement from '../Components/categoryManagement/CategoryManagement';
import Profile from '../Components/Profile';
import { Budget } from '../Models/Budget';
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
  console.log("my user", user, new Date());
  const transactions = await getTransactionsForUser(user.id);
  const categories = await getCategoriesForUser(user.id);
  const budgets: Budget[] = await getBudgetsForUser(user.id);

  return (
    <div className="mt-8">
      {/* <div className="">id: {user.id}</div>
      <div>username: {user.username}</div> */}
      <div className="max-w-screen-lg m-auto rounded">
        {/* <CategoryManagement
          userId={user.id}
          categories={categories}
        />
        <TransactionList
          userId={user.id}
          transactions={transactions}
          categories={categories}
        /> */}
        {/* <TransactionsForm userId={user.id} transactions={transactions} /> */}
        <Profile
          userId={user.id}
          categories={categories}
          transactions={transactions}
          budgets={budgets}
        />
      </div>
    </div>
  );
}
// here I can also add if I want to put profile image, or something I want to show to the public
// it's possible to have a user with a huge object(table in db)
