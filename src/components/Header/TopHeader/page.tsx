'use client';
import { getTopHeader } from '@/service/theme/getTopHeader';
import { TopHeaderType } from '@/Types/Theme/TopHeaderType';
import { useEffect, useState } from 'react';

export default function TopHeader() {
  const [topHeader, setTopHeader] = useState<TopHeaderType | null>(null);
  const [isVisible, setIsVisible] = useState(true); // State for visibility
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchTopHeaderSettings = async () => {
      try {
        const settings = await getTopHeader();
        setTopHeader(settings);
      } catch (error) {
        console.error('Error fetching top header settings:', error);
      } finally {
        setIsLoading(false); // Stop loading after data is fetched
      }
    };

    fetchTopHeaderSettings();
  }, []);

  if (!isVisible || isLoading || !topHeader || !topHeader.isEnable) return null;

  return (
    <div className="top-header bg-black text-white flex items-center justify-center relative w-full p-2">
      <div className="text-center flex items-center w-full overflow-hidden relative">
        {/* Marquee Wrapper */}
        {topHeader.description && (
          <div className="marquee-wrapper space-x-5">
            <p className="text-sm font-bold marquee">{topHeader.description}</p>
            <p className="text-sm font-bold marquee">{topHeader.description}</p> {/* Duplicate text for seamless loop */}
          </div>
        )}
      </div>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-transparent hover:bg-orange-400 rounded-full p-1"
        onClick={() => setIsVisible(false)}
        aria-label="Close top header"
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

      {/* Inline styles for the marquee animation */}
      <style jsx>{`
        .marquee-wrapper {
          display: flex;
          width: 200%; /* Make the wrapper large enough to fit both texts side by side */
        }

        .marquee {
          animation: marquee-fast 20s linear infinite; /* Continuous loop */
          white-space: nowrap;
          display: inline-block; /* Ensure it is treated as an inline element */
          letter-spacing: 0.1em; /* Adds spacing between characters */
          flex-shrink: 0; /* Prevent the text from shrinking */
        }

        @keyframes marquee-fast {
          0% {
            transform: translateX(100%); /* Start off-screen to the right */
          }
        
          100% {
            transform: translateX(-100%); /* End off-screen to the left */
          }
        }
      `}</style>
    </div>
  );
}
