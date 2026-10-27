export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getLadder } from '@/lib/rewards-storage';

// GET /api/admin/rewards/ladder - View all 4 ladder step rules
export async function GET() {
  try {
    const ladder = await getLadder();
    return NextResponse.json({ success: true, data: ladder }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching rewards ladder:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
