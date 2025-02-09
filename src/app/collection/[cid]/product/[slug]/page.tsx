'use client'
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductView from '@/components/Product/page';

export default function ProductViewPage() {
    const params = useParams() as Record<string, string>;
    const slug = params.slug;

    useEffect(() => {
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "ViewContent");
        }
    }, [slug]);  

    return (
        <div>
            <ProductView slug={slug} />
        </div>
    );
}
