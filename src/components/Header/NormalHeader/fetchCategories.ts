import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
interface Category {
    name: string;
    slug: string;
  }
  
  export const fetchCategories = async (): Promise<Array<Category>> => {
    const categories = await getAllDocsFromCollection<Category>("categories");
    return categories.map(({ name, slug }) => ({ name, slug }));
  };