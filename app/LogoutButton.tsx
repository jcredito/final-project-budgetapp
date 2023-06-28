'use client';

import { useRouter } from 'next/navigation';
import { logout } from './(auth)/logout/actions';

export function LogoutButton() {
  const router = useRouter();
  return (
    <form>
      {/* we dont need api route for logout, we need action*/}
      <button
        formAction={async () => {
          await logout();
          router.refresh();
        }}
      >
        Logout
      </button>
    </form>
  );
}
