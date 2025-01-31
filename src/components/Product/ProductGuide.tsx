'use client'
import { ProductType } from '@/Types/data/ProductType';
import React, { useState, useEffect } from 'react';
import { List, message } from 'antd';
import { getDataByDocName } from '@/service/Firebase/getFirestore';
import { Spinner } from '@nextui-org/react';
import Image from 'next/image';

interface Guide {
  id: string;
  title: string;
  type: 'image' | 'video';
  fileUrl: string;
}

interface ProductGuideProps {
  Product: ProductType;
}

export default function ProductGuide({ Product }: ProductGuideProps) {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guidesData, setGuidesData] = useState<{ [key: string]: Guide | null }>({});

  const fetchGuideDetails = async (guideId: string) => {
    setLoading(true);
    try {
      const guide = await getDataByDocName<Guide>('guides', guideId);
      if (guide) {
        setSelectedGuide(guide);
        setIsModalOpen(true);
      } else {
        message.error('Guide not found.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTitles = async () => {
      const updatedGuidesData: { [key: string]: Guide | null } = {};
      for (const guide of Product.guides || []) {
        if (guide.enabled) {
          const fetchedGuide = await getDataByDocName<Guide>('guides', guide.guideId);
          updatedGuidesData[guide.guideId] = fetchedGuide;
        }
      }
      setGuidesData(updatedGuidesData);
    };

    if (Product.guides?.some((guide) => guide.enabled)) {
      fetchTitles();
    }
  }, [Product.guides]);

  // Filter only enabled guides
  const enabledGuides = Product.guides?.filter((guide) => guide.enabled) || [];

  if (enabledGuides.length === 0) return null;

  return (
    <div>
      <List style={{ padding: 0, margin: 0 }}
        dataSource={enabledGuides}
        renderItem={(item) => (
          <List.Item>
            <button
              className="text-blue-600 underline cursor-pointer"
              onClick={() => fetchGuideDetails(item.guideId)}
              disabled={!guidesData[item.guideId]} // Disable if guide data isn't fetched yet
            >
              {guidesData[item.guideId]?.title || 'Loading...'}
            </button>
          </List.Item>
        )}
      />

      {/* Custom Tailwind Modal */}
      {isModalOpen && selectedGuide && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-sm sm:max-w-lg p-4 bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {loading ? (
              <div className="flex justify-center items-center p-10">
                <Spinner color="warning" />
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-center mb-4">{selectedGuide.title}</h2>
                {selectedGuide.type === 'image' ? (
                  <Image
                    src={selectedGuide.fileUrl}
                    alt={selectedGuide.title}
                    height={300}
                    width={300}
                    className="w-full rounded-lg"
                  />
                ) : selectedGuide.type === 'video' ? (
                  <video
                    src={selectedGuide.fileUrl}
                    autoPlay
                    className="w-full rounded-lg"
                  />
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
