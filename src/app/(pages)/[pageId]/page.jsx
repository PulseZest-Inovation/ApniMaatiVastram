'use client'
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useParams } from 'next/navigation';
import DOMPurify from 'dompurify';
import ReactHtmlParser from 'html-react-parser';
import { getDataByDocName } from '@/service/Firebase/getFirestore';
import { Spinner } from '@nextui-org/react';

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
    return (
      <div className="p-4 text-center text-gray-500">
        <Spinner color="warning" />
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="p-4 text-center text-gray-500">Page not found</div>
    );
  }

  // Sanitize the HTML content
  const sanitizedContent = DOMPurify.sanitize(pageData.content, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'u', 'span', 'br', 'b', 'i', 'a'],
    ALLOWED_ATTR: ['style', 'href', 'target'],
  });

  return (
    <>
      <Head>
        <title>{pageData.title}</title>
        <style>{`
          .prose h1 {
            font-size: 3rem; /* Increased from 2.25rem to 3rem */
            font-weight: bold;
            margin-bottom: 1.5rem;
          }
          .prose h2 {
            font-size: 2rem; /* Increased from 1.875rem */
            font-weight: semi-bold;
            margin-bottom: 1.25rem;
          }
          .prose h3 {
            font-size: 1.75rem; /* Increased from 1.5rem */
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
      <div className="px-6 py-6 lg:px-12 xl:px-20">
        <h1 className="text-2xl font-bold mb-4 text-center">{pageData.title}</h1>
        <div
          className="  prose-indigo w-full"
          dangerouslySetInnerHTML={{
            __html: sanitizedContent,
          }}
        />
      </div>
    </>
  );
};

export default PageViewPage;
