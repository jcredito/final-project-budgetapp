import { NextResponse } from 'next/server';

export function GET(): NextResponse<{ transactions: string }> {
  return NextResponse.json({ transactions: '/api/transactions' });
}
