import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaDB';

export async function GET() {
  try {
    // Brands are stored in CustomAttribute with attributeName "Brand"
    const brandAttributes = await prisma.customAttribute.findMany({
      where: {
        attributeName: {
          equals: 'Brand',
          mode: 'insensitive',
        },
      },
      select: {
        attributeValues: {
          select: {
            title: true,
          },
        },
      },
    });

    // Extract and deduplicate brand names
    const allBrands = brandAttributes.flatMap((attr) =>
      attr.attributeValues.map((v) => v.title)
    );
    const distinct = Array.from(new Set(allBrands)).filter(Boolean).sort();

    return NextResponse.json({ data: distinct });
  } catch (error) {
    console.error('Error fetching brands', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
