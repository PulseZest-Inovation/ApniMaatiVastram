import React from 'react';

const CustomerReviews: React.FC = () => (
  <div className="mt-6">
    <h2 className="text-xl font-bold mb-2">Customer Reviews</h2>
    <div className="flex items-center space-x-2">
      <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
      <span className="text-gray-600">4.5 (150 reviews)</span>
    </div>
    <p className="text-gray-600 mt-2">"Great product! Highly recommend it!"</p>
  </div>
);

export default CustomerReviews;
