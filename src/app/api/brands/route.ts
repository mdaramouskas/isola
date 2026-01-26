import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaDB';

export async function GET() {
  try {
    const brands = await prisma.additionalInformation.findMany({
      where: {
        name: {
          contains: 'brand',
          mode: 'insensitive',
        },
      },
      select: {
        description: true,
      },
    });

    // return distinct brand names
    const distinct = Array.from(new Set(brands.map((b) => b.description))).filter(Boolean);

    return NextResponse.json({ data: distinct });
  } catch (error) {
    console.error('Error fetching brands', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
