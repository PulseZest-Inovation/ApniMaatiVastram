'use client'
import { ProductType } from '@/Types/data/ProductType';
import React, { useState } from 'react';
import { Button, List, message } from 'antd';
import { getDataByDocName } from '@/service/Firebase/getFirestore';
import { Spinner } from '@nextui-org/react';

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
    } catch (error) {
      message.error('Failed to load guide.');
    } finally {
      setLoading(false);
    }
  };

  // Only render if there are guides
  if (!Product.guides || Product.guides.length === 0) return null;

  return (
    <div>
      <List style={{padding:0, margin:0}}
        dataSource={Product.guides}
        renderItem={(item) => (
          <List.Item>
            <Button type="link" onClick={() => fetchGuideDetails(item.guideId)}>
              View Guide
            </Button>
          </List.Item>
        )}
      />

      {/* Custom Tailwind Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-0 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-sm sm:max-w-lg sm:p-2 md:max-w-xl lg:max-w-2sm p-0"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 60 }}
          >
            {loading ? (
              <div className="flex justify-center items-center p-10">
                <Spinner color="warning" />
              </div>
            ) : selectedGuide?.type === 'image' ? (
              <img
                src={selectedGuide.fileUrl}
                alt={selectedGuide.title}
                className="w-full"
              />
            ) : selectedGuide?.type === 'video' ? (
              <video
                src={selectedGuide.fileUrl}
                autoPlay
                className="w-full"
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
