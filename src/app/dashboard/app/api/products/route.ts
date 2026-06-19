import { NextResponse } from 'next/server';
import { getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { appProductsCollection, db } from '@/lib/firebase-app';

// Helper to create slugs (e.g., "Mango Pickle" -> "mango_pickle")
function generateSlug(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '_')           // Replace spaces with _
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '_')         // Replace multiple - with single _
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// GET: Fetch all products
export async function GET() {
  try {
    const querySnapshot = await getDocs(appProductsCollection);
    const data: Record<string, any> = {};
    
    querySnapshot.forEach((doc) => {
      data[doc.id] = { id: doc.id, ...doc.data() };
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create or update a product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { documentId, ...productData } = body;

    if (!productData.name) {
      return NextResponse.json(
        { success: false, error: 'Product name is required' },
        { status: 400 }
      );
    }

    if (productData.stockCount !== undefined) {
      productData.stockCount = Number(productData.stockCount);
    }

    if (documentId) {
      // Update existing product
      const docRef = doc(appProductsCollection, documentId);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: new Date().toISOString()
      });
      return NextResponse.json({ success: true, message: 'Product updated successfully' }, { status: 200 });
    } else {
      // Create new product with slug as document ID
      const slug = generateSlug(productData.name);
      const productDocRef = doc(appProductsCollection, slug);
      
      const newData = {
        name: productData.name,
        description: productData.description || '',
        category: productData.category || 'Pickles',
        isBestSeller: productData.isBestSeller ?? false,
        isOutOfStock: productData.isOutOfStock ?? false,
        stockCount: productData.stockCount || 0,
        rating: productData.rating || 0,
        image: productData.image || '',
        weightPriceMap: productData.weightPriceMap || {},
        secretIngredient: productData.secretIngredient || null,
        ingredients: productData.ingredients || [],
        sommelierPairings: productData.sommelierPairings || [],
        origin: productData.origin || '',
        preparationMethod: productData.preparationMethod || '',
        storageInstructions: productData.storageInstructions || '',
        servingSuggestion: productData.servingSuggestion || '',
        shelfLife: productData.shelfLife || '',
        pairings: productData.pairings || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(productDocRef, newData);
      return NextResponse.json({ success: true, id: slug, message: 'Product created successfully' }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error saving product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a product
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const docRef = doc(appProductsCollection, id);
    await deleteDoc(docRef);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
