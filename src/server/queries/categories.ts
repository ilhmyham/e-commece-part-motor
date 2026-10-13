import { db } from "@/db";
import { category } from "@/db/schema";

export async function getCategoryTree() {
  const all = await db
    .select()
    .from(category)
    .orderBy(category.sortOrder);

  const parents = all.filter((c) => !c.parentId);
  const childrenByParent = new Map<string, typeof all>();

  for (const c of all) {
    if (c.parentId) {
      if (!childrenByParent.has(c.parentId)) {
        childrenByParent.set(c.parentId, []);
      }
      childrenByParent.get(c.parentId)!.push(c);
    }
  }

  return parents.map((p) => ({
    ...p,
    children: childrenByParent.get(p.id) ?? [],
  }));
}
