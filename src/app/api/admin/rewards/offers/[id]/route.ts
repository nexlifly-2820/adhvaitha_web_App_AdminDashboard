export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { updateOffer, deleteOffer } from '@/lib/rewards-storage';

// PUT /api/admin/rewards/offers/:id - Update or deactivate an offer
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offerId = parseInt(id, 10);
    if (isNaN(offerId)) {
      return NextResponse.json({ success: false, error: 'Invalid offer id' }, { status: 400 });
    }

    const body = await request.json();
    const updated = await updateOffer(offerId, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Offer #${offerId} updated successfully`,
      data: updated
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating reward offer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/rewards/offers/:id - Delete an offer
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offerId = parseInt(id, 10);
    if (isNaN(offerId)) {
      return NextResponse.json({ success: false, error: 'Invalid offer id' }, { status: 400 });
    }

    const success = await deleteOffer(offerId);

    return NextResponse.json({
      success,
      message: `Offer #${offerId} deleted successfully`
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting reward offer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
