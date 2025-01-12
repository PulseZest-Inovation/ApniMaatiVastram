import { getAllDocsFromCollection, getDataByDocName } from "@/service/Firebase/getFirestore";
import { FooterType } from "@/Types/Theme/footerType";
import { SocialMediaType } from "@/Types/Theme/SocialMediaType";

export const fetchFooterCategories = async () => {
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


export const fetchFooterSocialMedia = async ()=>{
  try {
    const socialMedia = await getDataByDocName<SocialMediaType>('theme-settings', 'social-media')
    return socialMedia;
  } catch (error) {
    console.log(error)
  }
}


export const fetchFooterData = async ()=>{
  try {
    const footerData = await getDataByDocName<FooterType>('theme-settings', 'footer')
    return footerData
  } catch (error) {
    console.log(error)
  }
}