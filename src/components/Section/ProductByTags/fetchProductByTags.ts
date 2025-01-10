import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { ProductType } from '@/Types/data/ProductType';
import { TagType } from '@/Types/data/TagsType';

export interface ProductsByTag {
  tagName: string;
  products: ProductType[];
}

export const fetchProductsGroupedByTags = async (): Promise<ProductsByTag[]> => {
  try {
    // Fetch all tags from the tags collection
    const tags: Array<TagType & { id: string }> = await getAllDocsFromCollection<TagType>('tags');

    // Filter tags where isEnable and isVisible are true
    const visibleTags = tags.filter(tag => tag.isVisible && tag.isVisible);

    if (visibleTags.length === 0) {
      return [];
    }

    // Fetch all products from the products collection
    const products: Array<ProductType & { id: string }> = await getAllDocsFromCollection<ProductType>('products');

    // Group products by tag name
    const productsByTags: ProductsByTag[] = visibleTags.map(tag => {
      const productsForTag = products.filter(product =>
        product.tags.includes(tag.name) // Check if the tag name exists in the product's tags array
      );
      return {
        tagName: tag.name,
        products: productsForTag,
      };
    });

    return productsByTags;
  } catch (error) {
    console.error('Error fetching products grouped by tags:', error);
    return [];
  }
};
