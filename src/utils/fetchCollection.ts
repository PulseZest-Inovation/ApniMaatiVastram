import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";

export const fetchCollections = async () => {
  try {
    const collections = await getAllDocsFromCollection<{ name: string; slug: string }>('categories');
    return collections; // This will return an array of categories with name and slug
  } catch (error) {
    console.error("Error fetching collections: ", error);
    return [];
  }
};
