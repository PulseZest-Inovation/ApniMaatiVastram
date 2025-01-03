'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head'; 
import { getDataByDocName } from '@/service/Firebase/getFirestore';
import { PageType } from '@/Types/data/PageType';

const PageViewPage = () => {
  const { pageId } = useParams() as Record<string,string>; 
  const [pageData, setPageData] = useState<PageType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pageId) {
      const fetchData = async () => {
        try {
          const data = await getDataByDocName<PageType>('pages', pageId);
          setPageData(data || null);
        } catch (error) {
          console.error('Error fetching page data:', error);
          setPageData(null);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [pageId]);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  if (!pageData) {
    return <div className="p-4 text-center text-gray-500">Page not found</div>;
  }

  return (
    <>
      <Head>
        <title>{pageData.title}</title> {/* Dynamically set the page title */}
      </Head>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4 text-center">{pageData.title}</h1>
        <div
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      </div>
    </>
  );
};

export default PageViewPage;
