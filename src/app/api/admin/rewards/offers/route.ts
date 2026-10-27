export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getOffers, createOffer } from '@/lib/rewards-storage';

// GET /api/admin/rewards/offers - List all reward offers in the prize pool
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stepParam = searchParams.get('step');
    const activeParam = searchParams.get('active');

    let offers = await getOffers();

    if (stepParam) {
      const stepNum = parseInt(stepParam, 10);
      if (!isNaN(stepNum)) {
        offers = offers.filter(o => o.step === stepNum);
      }
    }

    if (activeParam !== null) {
      const isActive = activeParam === 'true';
      offers = offers.filter(o => o.active === isActive);
    }

    return NextResponse.json({ success: true, data: offers }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reward offers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/rewards/offers - Create a new reward offer
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.discount_type || body.value === undefined || !body.step) {
      return NextResponse.json({
        success: false,
        error: 'Missing required offer fields: title, discount_type, value, step'
      }, { status: 400 });
    }

    const created = await createOffer({
      step: Number(body.step),
      title: body.title,
      subtitle: body.subtitle || '',
      image: body.image || '',
      discount_type: body.discount_type,
      value: Number(body.value),
      max_discount: body.max_discount ? Number(body.max_discount) : undefined,
      min_order: Number(body.min_order || 0),
      free_product_id: body.free_product_id ? Number(body.free_product_id) : undefined,
      free_product_name: body.free_product_name || '',
      valid_days: Number(body.valid_days || 7),
      weight: Number(body.weight || 1),
      budget_limit: body.budget_limit ? Number(body.budget_limit) : undefined,
      starts_at: body.starts_at,
      ends_at: body.ends_at,
      active: body.active !== undefined ? Boolean(body.active) : true
    });

    return NextResponse.json({
      success: true,
      message: 'Reward offer created successfully',
      data: created
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating reward offer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
