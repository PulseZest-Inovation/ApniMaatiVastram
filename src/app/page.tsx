import CategoriesDisplay from "@/components/Section/Categories/page"
import DisplayProductByTags from "@/components/Section/ProductByTags/page"
import ProductByVideos from "@/components/Section/ProductByVideos/page"

export default function Home() {
  return (
   <div>
      <CategoriesDisplay/>
      <DisplayProductByTags/>
      <ProductByVideos/>
      <h1>Hello</h1>
   </div>
  );
}
