import { NextResponse } from 'next/server';
import { doc, deleteDoc } from 'firebase/firestore';
import { webRecipesCollection } from '@/lib/firebase-web';

// DELETE: Remove a website recipe
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Recipe ID is required' }, { status: 400 });
    }

    const docRef = doc(webRecipesCollection, id);
    await deleteDoc(docRef);

    return NextResponse.json({ success: true, message: 'Recipe deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting website recipe:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
