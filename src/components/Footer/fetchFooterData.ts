import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";

export const fetchFooterData = async () => {
  try {
    // Fetch data from 'categories' collection
    const categories = await getAllDocsFromCollection<{ name: string; slug: string }>(
      "categories"
    );

    // Fetch data from 'pages' collection
    const pages = await getAllDocsFromCollection<{ title: string }>("pages");

    // Format categories and pages data
    const formattedCategories = categories.map((category) => ({
      name: category.name,
      slug: category.slug,
    }));

    const formattedPages = pages.map((page) => ({
      name: page.title,
      slug: page.id, // ID serves as the slug for pages
    }));

    // Export formatted data
    return { categories: formattedCategories, pages: formattedPages };
  } catch (error) {
    console.error("Error fetching footer data: ", error);
    return { categories: [], pages: [] };
  }
};
