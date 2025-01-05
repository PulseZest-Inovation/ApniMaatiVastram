'use client';

import React, { useEffect, useState } from 'react';
import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { TestimonialsType } from '@/Types/data/TestimonialsType';
import Image from 'next/image';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="flex-shrink-0 w-64 bg-white border border-gray-200 shadow-md rounded-lg p-4 flex flex-col items-center"
          >
            <Image
              src={testimonial.imageUrl}
              alt={testimonial.name}
              height={100} width={100}
              className="w-32 h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold text-lg text-center">{testimonial.name}</h3>
            <p className="text-gray-600 text-sm text-center mt-2">
              {testimonial.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
