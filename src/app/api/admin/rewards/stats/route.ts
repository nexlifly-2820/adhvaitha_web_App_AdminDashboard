export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getRewardStats } from '@/lib/rewards-storage';

// GET /api/admin/rewards/stats - View reward usage statistics
export async function GET() {
  try {
    const stats = await getRewardStats();
    return NextResponse.json({ success: true, data: stats }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reward stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
