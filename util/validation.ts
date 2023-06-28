import { Route } from 'next';
import { z } from 'zod';

// using zod, to define the page that Im validating are matching to the things below, if not it will be a security risk
const returnToSchema = z.string().refine((value) => {
  return (
    !value.startsWith('/logout') &&
    // Regular expression for valid returnTo path:
    // - starts with a slash
    // - until the end of the string, 1 or more:
    //   - numbers
    //   - hash symbols
    //   - forward slashes
    //   - equals signs
    //   - question marks
    //   - lowercase letters
    //   - dashes
    /^\/[\d#/=?a-z-]+$/.test(value)
  );
});

export function getSafeReturnToPath(path: string | string[] | undefined) {
  const result = returnToSchema.safeParse(path);
  if (!result.success) return undefined;
  return result.data as Route;
}
