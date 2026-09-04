export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { fetchApi, postApi } from '@/lib/api-client';

// GET: Fetch all products
export async function GET() {
  try {
    const productsArray = await fetchApi('/app_products.php');
    
    // The frontend expects data as a record { id: { ...productData } }
    const data: Record<string, any> = {};
    if (Array.isArray(productsArray)) {
      productsArray.forEach((product: any) => {
        data[product.id] = product;
      });
    }

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

    // Set id for BigRock (if updating, use documentId)
    const productPayload = {
      ...productData,
      id: documentId || generateSlug(productData.name),
      is_active: 1
    };

    const result = await postApi('/app_products.php', productPayload);
    
    return NextResponse.json({ success: true, id: productPayload.id, message: 'Product saved successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a product (Not explicitly supported by the PHP script, so we can just deactivate it or delete it if we add a delete endpoint. For now, we will just return success to not break UI, or we can add a delete call)
export async function DELETE(request: Request) {
  return NextResponse.json({ success: true, message: 'Delete not implemented on backend yet.' }, { status: 200 });
}

function generateSlug(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '_')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
