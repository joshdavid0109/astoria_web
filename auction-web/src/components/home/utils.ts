// src/components/home/utils.ts
export const detectCategoryGroups = (categories: { categories_id: number; name: string }[]) => {
  const groups: Record<string, string[]> = {
    tech: [],
    fashion: [],
    home: [],
    family: [],
    food: [],
    auto: [],
    entertainment: [],
    other: [],
  };

  const n = (s: string) => (s || "").toLowerCase();

  const map = {
    tech: [/gadget/, /electro/, /computer/, /laptop/, /phone/, /electronics/],
    fashion: [/clothing/, /fashion/, /shoe/, /jewel/, /beauty/],
    home: [/home/, /kitchen/, /furnitur/, /appliance/, /household/],
    family: [/toy/, /baby/, /kids/, /books/, /family/, /games/],
    food: [/grocery/, /food/, /gourmet/, /deli/],
    auto: [/automotive/, /auto/, /car/, /vehicle/],
    entertainment: [/movie/, /music/, /video/, /entertain/],
  };

  categories.forEach((c) => {
    const s = n(c.name);
    let matched = false;
    for (const key of Object.keys(map)) {
      const patterns = (map as any)[key] as RegExp[];
      if (patterns.some((re) => re.test(s))) {
        (groups as any)[key].push(c.name);
        matched = true;
        break;
      }
    }
    if (!matched) groups.other.push(c.name);
  });

  Object.keys(groups).forEach((k) => {
    if ((groups as any)[k].length === 0) delete (groups as any)[k];
  });

  return groups;
};
