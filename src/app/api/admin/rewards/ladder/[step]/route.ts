export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { updateLadderStep } from '@/lib/rewards-storage';

// PUT /api/admin/rewards/ladder/:step - Update required delivered orders or rule for a step
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ step: string }> }
) {
  try {
    const { step } = await params;
    const stepNum = parseInt(step, 10);
    if (isNaN(stepNum)) {
      return NextResponse.json({ success: false, error: 'Invalid step number' }, { status: 400 });
    }

    const body = await request.json();
    const updatedLadder = await updateLadderStep(stepNum, body);
    const updatedStep = updatedLadder.find(s => s.step === stepNum);

    return NextResponse.json({
      success: true,
      message: `Step ${stepNum} updated successfully`,
      data: updatedStep
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating ladder step:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
