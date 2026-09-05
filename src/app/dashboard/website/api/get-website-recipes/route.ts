import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/api-client';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET: Fetch all website recipes
export async function GET() {
  try {
    const rawData = await fetchApi('/recipes.php');
    
    // Sort by creation date descending
    const data = Array.isArray(rawData) ? rawData : [];
    data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return NextResponse.json({ success: true, data }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error('Error fetching website recipes:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
