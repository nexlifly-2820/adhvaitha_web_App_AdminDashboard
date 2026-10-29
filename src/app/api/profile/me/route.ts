import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const userIdHeader = request.headers.get('x-user-id') || '';

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const targetUrl = `${BIGROCK_API_URL}/profile.php${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(userIdHeader ? { 'X-User-Id': userIdHeader } : {}),
      },
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({
      name: 'Arun Kumar',
      phone: '+91 98765 43210',
      since: '2023',
      address: 'Hyderabad, Telangana',
      orders: 0,
      wishlist: 0,
      photoUrl: '',
    }));

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        name: 'Arun Kumar',
        phone: '+91 98765 43210',
        since: '2023',
        address: 'Hyderabad, Telangana',
        orders: 0,
        wishlist: 0,
        photoUrl: '',
        error: error.message,
      },
      { status: 200 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const userIdHeader = request.headers.get('x-user-id') || '';
    const body = await request.json();

    const targetUrl = `${BIGROCK_API_URL}/profile.php`;
    const res = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(userIdHeader ? { 'X-User-Id': userIdHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({ success: true }));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
