import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const collection = await getCollection('access_requests');
    const count = await collection.countDocuments();
    const BASE_COUNT = 1247;

    return NextResponse.json(
      { count: BASE_COUNT + count },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('GET /api/access-requests/count Error:', error);
    return NextResponse.json(
      { count: 1247 },
      { headers: corsHeaders }
    );
  }
}
