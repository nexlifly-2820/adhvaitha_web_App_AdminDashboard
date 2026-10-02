export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/api-client';

export async function GET() {
  try {
    const data = await fetchApi('/api/users.php');
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
