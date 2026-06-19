import { NextResponse } from 'next/server';
import { doc, setDoc } from 'firebase/firestore';
import { webProductsCollection } from '@/lib/firebase-web';

// POST: Create or update a website product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      productName, 
      productDescription, 
      category, 
      minInput, 
      minUnit, 
      maxInput, 
      maxUnit, 
      images 
    } = body;

    // Strict validation
    if (!productName || productName.length > 100) {
      return NextResponse.json({ success: false, error: 'Product name is required and must be under 100 characters.' }, { status: 400 });
    }
    if (!productDescription || productDescription.length > 2000) {
      return NextResponse.json({ success: false, error: 'Product description is required and must be under 2000 characters.' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category is required.' }, { status: 400 });
    }
    if (!minInput || !minUnit || !maxInput || !maxUnit) {
      return NextResponse.json({ success: false, error: 'Min/Max inputs and units are required.' }, { status: 400 });
    }
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ success: false, error: 'At least one image is required.' }, { status: 400 });
    }

    const documentId = body.id;
    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Product ID is required.' }, { status: 400 });
    }
    
    const productDocRef = doc(webProductsCollection, documentId);
    
    const newData: any = {
      id: documentId,
      productName,
      productDescription,
      category,
      minQuantity: { value: minInput, unit: minUnit },
      maxQuantity: { value: maxInput, unit: maxUnit },
      images: images || [],
      updatedAt: new Date().toISOString()
    };

    if (body.isNew) {
      newData.createdAt = new Date().toISOString();
    }

    await setDoc(productDocRef, newData, { merge: true });
    
    return NextResponse.json({ success: true, id: documentId, message: body.isNew ? 'Product published successfully' : 'Product updated successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error publishing website product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
