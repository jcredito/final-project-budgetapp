import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../database/sessions';
import { getTransactionsForUser } from '../../database/transactions';
import {getBudgetsForUser} from '../../database/budgets';
import { getUserBySessionToken } from '../../database/users';
import { getCategoriesForUser } from '../../database/categories';
import Profile from '../Components/Profile';
import { Budget } from '../Models/Budget';

export default async function ProfileUsernamePage() {
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  const user = session && (await getUserBySessionToken(session.token));
  if (!user) redirect('/login?returnTo=/profile');
  const transactions = await getTransactionsForUser(user.id);
  const categories = await getCategoriesForUser(user.id);
  const budgets: Budget[] = await getBudgetsForUser(user.id);

  return (
    <div className="mt-8">
      <div className="max-w-screen-lg m-auto rounded">
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
