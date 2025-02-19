import { ApplicationConfig } from "@/config/ApplicationConfig";
import Link from "next/link";

 
 
const PopularCategories = () => {
  return (
    <div className="w-full md:w-1/4">
      <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
      <ul className="space-y-2">
        <li> <Link href={`${ApplicationConfig.baseUrl}/collection/ready-to-wear-sarees`}>Ready to Wear saree</Link> </li>
        <li> <Link href={`${ApplicationConfig.baseUrl}/collection/pre-pleated-sarees`}>Pre pleated saree</Link> </li>
        <li> <Link href={`${ApplicationConfig.baseUrl}/collection/sarees`}>Sarees</Link> </li>
        <li> <Link href={`${ApplicationConfig.baseUrl}/collection/blouse`}>Blouses </Link> </li>
        <li> <Link href={`${ApplicationConfig.baseUrl}/collection/earrings`}>Earrings </Link> </li>
        <li> <Link href={`${ApplicationConfig.baseUrl}/collection/office-wear-saree`}>Office wear Saree </Link> </li>
      </ul>
    </div>
  );
};

export default PopularCategories;
