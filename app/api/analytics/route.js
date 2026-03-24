import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// POST — Track analytics event
export async function POST(request) {
  try {
    const body = await request.json();
    const { event, page, data, sessionId } = body;

    if (!event) {
      return NextResponse.json(
        { error: 'Event name is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const collection = await getCollection('analytics');

    const analyticsEvent = {
      event,
      page: page || '/',
      data: data || {},
      sessionId: sessionId || null,
      userAgent: request.headers.get('user-agent') || null,
      timestamp: new Date(),
    };

    await collection.insertOne(analyticsEvent);

    return NextResponse.json(
      { success: true },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('POST /api/analytics Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// GET — Analytics summary
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const collection = await getCollection('analytics');

    const [totalPageViews, uniqueSessions, eventBreakdown] = await Promise.all([
      collection.countDocuments({ event: 'page_view', timestamp: { $gte: since } }),
      collection.distinct('sessionId', { timestamp: { $gte: since } }),
      collection.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: '$event', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
    ]);

    return NextResponse.json(
      {
        period: `${days} days`,
        totalPageViews,
        uniqueSessions: uniqueSessions.length,
        eventBreakdown: eventBreakdown.map(e => ({ event: e._id, count: e.count })),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('GET /api/analytics Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
