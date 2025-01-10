'use client'
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useParams } from 'next/navigation';
import ReactHtmlParser from 'html-react-parser';
import { getDataByDocName } from '@/service/Firebase/getFirestore';

const PageViewPage = () => {
  const { pageId } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pageId) {
      const fetchData = async () => {
        try {
          const data = await getDataByDocName('pages', pageId);
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

  // Render HTML content dynamically
  const renderHtmlContent = (content) => {
    const parsedElements = ReactHtmlParser(content);
    return parsedElements;
  };

  return (
    <>
      <Head>
        <title>{pageData.title}</title>
        <style>{`
          .prose h1 {
            font-size: 2.25rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
          .prose h2 {
            font-size: 1.875rem;
            font-weight: semi-bold;
            margin-bottom: 1rem;
          }
          .prose h3 {
            font-size: 1.5rem;
            font-weight: medium;
            margin-bottom: 1rem;
          }
          .prose p {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 1rem;
          }
        `}</style>
      </Head>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4 text-center">{pageData.title}</h1>
        <div
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto"
          dangerouslySetInnerHTML={{
            __html: pageData.content, // Dynamically injected content
          }}
        />
      </div>
    </>
  );
};

export default PageViewPage;
