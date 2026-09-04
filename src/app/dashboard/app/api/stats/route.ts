import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/api-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchApi('/dashboard_stats.php');
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
