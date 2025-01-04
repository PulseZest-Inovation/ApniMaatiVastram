'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ApplicationConfig } from '@/config/ApplicationConfig';
import { ProductType } from '@/Types/data/ProductType';

export default function CollectionPage() {
  const params = useParams() as Record<string, string>;
  const category = params.cid;
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const Route = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, 'app_name', ApplicationConfig.secretKey, 'products');
        const q = query(productsRef, where('categories', 'array-contains', category));
        const querySnapshot = await getDocs(q);
        const fetchedProducts: ProductType[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ProductType[];
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleLoveClick = (productId: string) => {
    console.log(`Product ${productId} loved!`);
    // Add logic for handling the love icon click, e.g., updating the database
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 uppercase text-center">{category}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 cursor-pointer">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-2 rounded shadow flex flex-col items-center bg-white"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            onClick={()=> {  Route.push(`/collection/${category}/product/${product.id}`)}}
          >
            <div className="relative w-full h-60 sm:h-80">
              {hoveredProduct === product.id &&
              product.galleryImages &&
              product.galleryImages.length > 0 ? (
                <Image
                  src={product.galleryImages[0]} // Display the first gallery image on hover
                  alt={`${product.productTitle} - gallery`}
                  fill
                  className="object-cover rounded"
                />
              ) : (
                <Image
                  src={product.featuredImage}
                  alt={product.id}
                  fill
                  className="object-cover rounded"
                />
              )}
              <div
                className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer"
                onClick={() => handleLoveClick(product.id)}
              >
                <Image
                  src="/Icons/heart.png" // Replace with the path to your love icon
                  alt="Love Icon"
                  width={24}
                  height={24}
                />
              </div>
            </div>
            <h2 className="font-light fontfma mt-2 text-center capitalize">{product.productTitle}</h2>
            <div className="text-center mt-2">
              {product.salePrice ? (
                <div className="flex items-center justify-center">
                  <p className="text-sm text-gray-500 line-through">₹{product.regularPrice}</p>
                  <p className="text-sm text-black pl-2">₹{product.salePrice}</p>
                </div>
              ) : (
                <p className="text-sm text-black font-light">₹{product.regularPrice}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
