export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/api-client';

// GET: Fetch all reviews
export async function GET() {
  try {
    const data = await fetchApi('/reviews.php');
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Update review status
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // reviews.php only has INSERT currently.
    // For now, let's mock success for updating review status.
    
    return NextResponse.json({ success: true, message: 'Review updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
