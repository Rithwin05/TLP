import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { client } = await connectToDatabase();
    await client.db('admin').command({ ping: 1 });

    return NextResponse.json({
      status: 'ok',
      message: 'The Last Puff API is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'degraded',
      message: 'API running, database unavailable',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
}
