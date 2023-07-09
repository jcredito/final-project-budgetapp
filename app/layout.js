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
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <nav className={`${styles.navBar} bg-gray-200`}>
          <div className={styles.navLinks}>
            <Link href="/">BudgetApp</Link>
          </div>
          <div className={`${styles.loginButtons}`}>
            {user ? (
              <>
                <Link href="/profile">Profile</Link>
                <div>{user.username}</div>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link className={styles.loginButton} href="/login">
                  login
                </Link>
                <Link className={styles.registerButton} href="/register">
                  register
                </Link>
              </>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
