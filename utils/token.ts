import { subDays } from 'date-fns';

export function checkExpiry(expiry: string, tokenName: string) {
  const expiryDate = new Date(expiry);
  const minus10Days = subDays(new Date(), 10);

  if (expiryDate < minus10Days) {
    throw new Error(
      `Token ${tokenName} expires on ${expiryDate}. Failing to promote renewing!`,
    );
  }
}
