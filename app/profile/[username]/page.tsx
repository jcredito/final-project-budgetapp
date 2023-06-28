import { notFound } from 'next/navigation';
import { getUserByUsername } from '../../../database/users';
import TransactionsForm from '../../Components/TransactionsForm';

type Props = {
  params: { username: string };
};

export default async function ProfileUsernamePage({ params }) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  // here I can also add if I want to put profile image, or something I want to show to the public
  // it's possible to have a user with a huge object(table in db)
  return (
    <>
      <div>id: {user.id}</div>
      <div>username: {user.username}</div>
      <TransactionsForm />
    </>
  );
}
