import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";

export const fetchProducts = async (categorySlug: string) => {
  try {
    // Fetch all products from the 'products' collection
    const products = await getAllDocsFromCollection<{ name: string; categories: string[] }>('products');

    // Filter the products by the provided categorySlug and use the first category in the 'categories' array
    return products
      .filter(product => product.categories[0] === categorySlug) // Use the first category for matching
      .map(product => ({
        id: product.id,  // Use the document id as the product slug
        name: product.name,
        slug: product.id,  // Slug is the product id
      }));
  } catch (error) {
    console.error("Error fetching products: ", error);
    return [];
  }
};
