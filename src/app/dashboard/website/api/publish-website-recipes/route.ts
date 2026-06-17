import { NextResponse } from 'next/server';
import { doc, setDoc } from 'firebase/firestore';
import { webRecipesCollection } from '@/lib/firebase-web';

// POST: Create or update a website recipe
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      recipeName, 
      recipeDescription, 
      category, 
      makingTimeInput,
      makingTimeUnit,
      ingredients,
      makingProcess,
      difficulty,
    } = body;

    // Strict validation
    if (!recipeName || recipeName.length > 100) {
      return NextResponse.json({ success: false, error: 'Recipe name is required and must be under 100 characters.' }, { status: 400 });
    }
    if (!recipeDescription || recipeDescription.length > 2000) {
      return NextResponse.json({ success: false, error: 'Recipe description is required and must be under 2000 characters.' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category is required.' }, { status: 400 });
    }
    if (!makingTimeInput || !makingTimeUnit) {
      return NextResponse.json({ success: false, error: 'Making time input and unit are required.' }, { status: 400 });
    }
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ success: false, error: 'At least one ingredient is required.' }, { status: 400 });
    }
    if (!makingProcess || makingProcess.length > 5000) {
      return NextResponse.json({ success: false, error: 'Making process is required and must be under 5000 characters.' }, { status: 400 });
    }
    if (!difficulty) {
      return NextResponse.json({ success: false, error: 'Process difficulty is required.' }, { status: 400 });
    }

    const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = generateSlug(recipeName);
    
    const recipeDocRef = doc(webRecipesCollection, slug);
    
    const newData = {
      id: slug,
      recipeName,
      recipeDescription,
      category,
      makingTime: { value: makingTimeInput, unit: makingTimeUnit },
      ingredients,
      makingProcess,
      difficulty,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(recipeDocRef, newData, { merge: true });
    
    return NextResponse.json({ success: true, id: slug, message: 'Recipe published successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error publishing website recipe:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
