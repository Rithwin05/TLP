import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'lastthepuff';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGO_URL, {
    maxPoolSize: 10,
  });

  const db = client.db(DB_NAME);
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Main router
export async function GET(request, { params }) {
  const path = params?.path?.join('/') || '';

  try {
    // Health check
    if (path === '' || path === 'health') {
      return NextResponse.json(
        { status: 'ok', message: 'Last The Puff API is running' },
        { headers: corsHeaders }
      );
    }

    // Get access requests count
    if (path === 'access-requests/count') {
      const { db } = await connectToDatabase();
      const collection = db.collection('access_requests');
      const count = await collection.countDocuments();
      
      // Base count to show social proof
      const BASE_COUNT = 1247;
      const totalCount = BASE_COUNT + count;

      return NextResponse.json(
        { count: totalCount },
        { headers: corsHeaders }
      );
    }

    // Get all access requests (admin endpoint)
    if (path === 'access-requests') {
      const { db } = await connectToDatabase();
      const collection = db.collection('access_requests');
      const requests = await collection
        .find({})
        .sort({ created_at: -1 })
        .limit(100)
        .toArray();

      return NextResponse.json(
        { requests },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Not found' },
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request, { params }) {
  const path = params?.path?.join('/') || '';

  try {
    // Submit access request
    if (path === 'access-requests') {
      const body = await request.json();
      const { name, phone, email, college, interest } = body;

      // Validation
      if (!name || !phone || !email) {
        return NextResponse.json(
          { error: 'Name, phone, and email are required' },
          { status: 400, headers: corsHeaders }
        );
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400, headers: corsHeaders }
        );
      }

      // Phone validation (basic)
      const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { error: 'Invalid phone number' },
          { status: 400, headers: corsHeaders }
        );
      }

      const { db } = await connectToDatabase();
      const collection = db.collection('access_requests');

      // Check for duplicate email or phone
      const existingRequest = await collection.findOne({
        $or: [{ email: email.toLowerCase() }, { phone: phone }]
      });

      if (existingRequest) {
        return NextResponse.json(
          { 
            success: true, 
            message: 'You are already on the premiere list!',
            alreadyExists: true 
          },
          { headers: corsHeaders }
        );
      }

      // Create new access request
      const accessRequest = {
        id: uuidv4(),
        name: name.trim(),
        phone: phone.trim(),
        email: email.toLowerCase().trim(),
        college: college?.trim() || null,
        interest: interest?.trim() || null,
        created_at: new Date(),
      };

      await collection.insertOne(accessRequest);

      return NextResponse.json(
        {
          success: true,
          message: 'You are now on the premiere list.',
          id: accessRequest.id
        },
        { status: 201, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Not found' },
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
