import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { ProductType } from '@/Types/data/ProductType';
import { CategoryType } from '@/Types/data/CategoryType';

export interface ProductsByCategory {
  categoryName: string;
  products: ProductType[];
}

export const fetchProductsGroupedByCategories = async (): Promise<ProductsByCategory[]> => {
  try {
    // Fetch all categories from the categories collection
    const categories: Array<CategoryType & { id: string }> = await getAllDocsFromCollection<CategoryType>('categories');

    // Filter categories where isVisible is true
    const visibleCategories = categories.filter(category => category.isVisible);

    if (visibleCategories.length === 0) {
      return [];
    }

    // Fetch all products from the products collection
    const products: Array<ProductType & { id: string }> = await getAllDocsFromCollection<ProductType>('products');

    // Group products by category name
    const productsByCategories: ProductsByCategory[] = visibleCategories.map(category => {
      const productsForCategory = products.filter(product =>
        product.categories.includes(category.cid) // Check if the category id exists in the product's categories array
      );
      return {
        categoryName: category.name,
        products: productsForCategory,
      };
    });

    return productsByCategories;
  } catch (error) {
    console.error('Error fetching products grouped by categories:', error);
    return [];
  }
};
