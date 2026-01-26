import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaDB';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, slug: true },
    });
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('Error fetching categories for menu', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
