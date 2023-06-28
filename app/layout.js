import './globals.css';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getUserBySessionToken } from '../database/users';
import styles from './layout.module.scss';
import { LogoutButton } from './LogoutButton';

const inter = Inter({ subsets: ['latin'] });

// title: { default: 'BudgetApp | Register",
// description="My BudgetApp",
//};

export default async function RootLayout({ children }) {
  // 1. get the session token from the cookie
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  const user = !sessionToken?.value
    ? undefined
    : await getUserBySessionToken(sessionToken.value);

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          <div className={styles.nav2}>
            {user ? (
              <>
                <div>{user.username}</div>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/register">register</Link>
                <Link href="/login">login</Link>
              </>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
