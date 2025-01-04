'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig'; // Adjust this path to your Firebase setup
import Image from 'next/image';
import { ApplicationConfig } from '@/config/ApplicationConfig';
import { ProductType } from '@/Types/data/ProductType';

export default function CollectionPage() {
  const params = useParams() as Record<string, string>;
  const category = params.cid;
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 uppercase text-center">{category}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-2 rounded shadow flex flex-col items-center bg-white"
          >
            <div className="relative w-full h-60 sm:h-80">
              <Image
                src={product.featuredImage}
                alt={product.id}
                fill
                className="object-cover rounded"
              />
            </div>
            <h2 className="font-semibold mt-2 text-center">{product.id}</h2>
            <p className="text-lg font-bold text-green-600 text-center">₹{product.regularPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
