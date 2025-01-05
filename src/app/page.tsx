import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css'; 
import ImageCarousle from "@/components/Carousel/page";
import CategoriesDisplay from "@/components/Section/Categories/page"
import DisplayProductByTags from "@/components/Section/ProductByTags/page"
import ProductByVideos from "@/components/Section/ProductByVideos/page"

export default function Home() {
  return (
   <div>
      <CategoriesDisplay/>
      <ImageCarousle/>
      <DisplayProductByTags/>
      <ProductByVideos/>
      <h1>Hello</h1>
   </div>
  );
}
