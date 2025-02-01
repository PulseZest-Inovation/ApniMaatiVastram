// src/service/Firebase/getCategories.ts
import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
import { CategoryType } from "@/Types/data/CategoryType";

export const fetchCategories = async (): Promise<CategoryType[]> => {
  try {
    const categories = await getAllDocsFromCollection<CategoryType>("categories");
    return categories.map(({ cid, count, image, isPosition, name, slug, isVisible, isHeaderVisible, parent }) => ({
      cid,
      count,
      isHeaderVisible,
      image,
      isPosition,
      name,
      slug,
      isVisible,
      parent
    }));
  } catch (error) {
    console.error("Error fetching categories: ", error);
    return [];
  }
};
