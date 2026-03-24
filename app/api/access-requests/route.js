import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET all access requests (admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const collection = await getCollection('access_requests');
    const [requests, total] = await Promise.all([
      collection.find({}).sort({ created_at: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(),
    ]);

    return NextResponse.json(
      { requests, total, page, limit, pages: Math.ceil(total / limit) },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('GET /api/access-requests Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST new access request
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, college, interest } = body;

    // Validation
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Name, phone, and email are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400, headers: corsHeaders }
      );
    }

    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400, headers: corsHeaders }
      );
    }

    const collection = await getCollection('access_requests');

    // Duplicate check
    const existing = await collection.findOne({
      $or: [{ email: email.toLowerCase() }, { phone: phone }],
    });

    if (existing) {
      return NextResponse.json(
        { success: true, message: 'You are already on the premiere list!', alreadyExists: true },
        { headers: corsHeaders }
      );
    }

    const accessRequest = {
      id: uuidv4(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      college: college?.trim() || null,
      interest: interest?.trim() || null,
      source: 'website',
      created_at: new Date(),
      updated_at: new Date(),
    };

    await collection.insertOne(accessRequest);

    return NextResponse.json(
      { success: true, message: 'You are now on the premiere list.', id: accessRequest.id },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('POST /api/access-requests Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
