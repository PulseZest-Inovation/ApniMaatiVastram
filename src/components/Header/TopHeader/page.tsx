'use client';
import { getTopHeader } from '@/service/theme/getTopHeader';
import { TopHeaderType } from '@/Types/Theme/TopHeaderType';
import { useEffect, useState } from 'react';

export default function TopHeader() {
  const [topHeader, setTopHeader] = useState<TopHeaderType | null>(null);
  const [isVisible, setIsVisible] = useState(true); // State for visibility

  useEffect(() => {
    const fetchTopHeaderSettings = async () => {
      try {
        const settings = await getTopHeader();
        setTopHeader(settings);
      } catch (error) {
        console.error('Error fetching top header settings:', error);
        // Handle errors gracefully (e.g., display a fallback message)
      }
    };

    fetchTopHeaderSettings();
  }, []);

  if (!isVisible || !topHeader || !topHeader.isEnable) return null; // Hide component if not visible

  return (
    <div className="top-header bg-orange-300 text-white flex items-center justify-center relative p-2">
      <div className="text-center">
        {topHeader.description && <p className="text-sm">{topHeader.description}</p>}
        {topHeader.text && (
          <a
            href={topHeader.link}
            className="text-sm underline hover:no-underline font-medium"
          >
            {topHeader.text}
          </a>
        )}
      </div>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-transparent hover:bg-orange-400 rounded-full p-1"
        onClick={() => setIsVisible(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}