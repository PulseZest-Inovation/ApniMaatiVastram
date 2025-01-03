'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import ProductView from '@/components/Product/page';

export default function ProductViewPage() {
    const params = useParams() as Record<string, string>;
    const slug = params.productId;
  return (
    <div>
        <ProductView slug={slug}/>
    </div>
  )
}
