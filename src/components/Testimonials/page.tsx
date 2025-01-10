'use client';

import React, { useState, useEffect } from 'react';
import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { TestimonialsType } from '@/Types/data/TestimonialsType';
import Image from 'next/image';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({}); // State to track expansion for each testimonial

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllDocsFromCollection<TestimonialsType>('testimonials');
        setTestimonials(data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to fetch testimonials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="flex space-x-4 overflow-x-scroll scrollbar-hide p-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="w-64 h-80 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No testimonials available at the moment.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-center text-2xl font-bold mb-6 uppercase font-serif">Testimonials</h2>
      <div className="flex space-x-4 overflow-x-scroll scrollbar-hide">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.name}
            className="flex-shrink-0 w-64 bg-white border border-gray-200 shadow-md rounded-lg p-4 flex flex-col items-center"
          >
            {/* Image with hover effect */}
            <div className="relative w-32 h-40">
              <Image
                src={testimonial.imageUrls[0]} // Default image (first index)
                alt={testimonial.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg mb-4 transition-opacity duration-300"
              />
              {testimonial.imageUrls[1] && (
                <Image
                  src={testimonial.imageUrls[1]} // Second image on hover
                  alt={`${testimonial.name} hover`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg mb-4 opacity-0 hover:opacity-100 transition-opacity duration-300 absolute top-0 left-0"
                />
              )}
            </div>
            <h3 className="font-semibold text-lg text-center">{testimonial.name}</h3>

            {/* Truncate text to 20 words */}
            <p className="text-gray-600 text-sm text-center mt-2">
              {testimonial.text.split(' ').slice(0, 20).join(' ')}
              {testimonial.text.split(' ').length > 20 && (
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setExpanded((prev) => ({
                    ...prev,
                    [index]: !prev[index], // Toggle the state for the specific testimonial
                  }))}
                >
                  {' '}Read More
                </span>
              )}
            </p>
            {/* Expanded Text */}
            {expanded[index] && (
              <p className="text-gray-600 text-sm text-center mt-2">
                {testimonial.text}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
