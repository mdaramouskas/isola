import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function upsertCategoryTree(categories: any[], parentId?: number) {
  for (const cat of categories) {
    let existing = await prisma.category.findFirst({ where: { externalId: cat.Id } as any });
    let created;
    if (existing) {
      created = await prisma.category.update({ where: { id: existing.id } as any, data: { title: cat.Description, externalId: cat.Id, parentId } as any } as any);
    } else {
      created = await prisma.category.create({ data: { title: cat.Description, slug: `cat-${cat.Code}`, img: '', description: '', externalId: cat.Id, parentId } as any } as any);
    }

    if (Array.isArray(cat.SubCategories) && cat.SubCategories.length > 0) {
      await upsertCategoryTree(cat.SubCategories, created.id);
    }
  }
}
