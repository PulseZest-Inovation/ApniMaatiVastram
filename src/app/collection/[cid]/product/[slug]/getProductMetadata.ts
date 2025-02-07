import { Metadata } from "next";
import { ApplicationConfig } from "@/config/ApplicationConfig";
import { ProductType } from "@/Types/data/ProductType";

export async function getProductMetadata(slug: string): Promise<Metadata> {
  try {
    // Fetch product details
    const response = await fetch(
      `${ApplicationConfig.baseUrl}/api/products/${slug}`,
      { cache: "force-cache" } // Caching for performance
    );

    if (!response.ok) {
      return {
        title: "Product Not Found",
        description: "The product you are looking for is not available.",
      };
    }

    const product: ProductType = await response.json();

    return {
      title: `${product.productTitle} - Buy Now`,
      description: product.shortDescription || "Get the best products online.",
      openGraph: {
        type: "website",
        url: `${ApplicationConfig.baseUrl}/collection/${product.categories?.[0] || "all"}/product/${slug}`,
        title: product.productTitle,
        description: product.shortDescription || "",
        images: [
          {
            url: product.featuredImage || "/default-product-image.jpg",
            width: 1200,
            height: 630,
            alt: product.productTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: product.productTitle,
        description: product.shortDescription || "",
        images: [product.featuredImage || "/default-product-image.jpg"],
      },
    };
  } catch (error) {
    console.error("Error fetching product metadata:", error);
    return {
      title: "Product Details",
      description: "Explore our products with great offers!",
    };
  }
}
