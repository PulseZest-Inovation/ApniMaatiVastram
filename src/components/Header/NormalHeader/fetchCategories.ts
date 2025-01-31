import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
import { CategoryType } from "@/Types/data/CategoryType";

export const fetchCategories = async (): Promise<Array<CategoryType>> => {
  try {
    const categories = await getAllDocsFromCollection<CategoryType>("categories");
    return categories.map((category) => ({
      cid: category.cid ?? "",
      count: category.count ?? 0,
      image: category.image ?? "",
      isPosition: category.isPosition ?? "",
      name: category.name ?? "",
      slug: category.slug ?? "",
      isVisible: category.isVisible ?? false,
      isHeaderVisible: category.isHeaderVisible ?? false,
      parent: category.parent ?? "none"
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
