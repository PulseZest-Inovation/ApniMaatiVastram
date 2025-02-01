'use client';
import React, { useState } from 'react';
import SparklesText from '../ui/sparkles-text';
import Card from '@mui/material/Card';

interface Product {
  isPrePlated: boolean;
  prePlatedCharges: number;
}

interface ReadyToPrePlatedProps {
  product: Product;
  onFieldsChange: (fields: { waist: number }) => void;
  onPrePlatedChange: (isPrePlated: boolean) => void; 
}

const ReadyToPrePlated: React.FC<ReadyToPrePlatedProps> = ({ product, onFieldsChange, onPrePlatedChange }) => {
  const [showFields, setShowFields] = useState(false);
  const [fields, setFields] = useState({ waist: 0 });

  // Handle checkbox toggle
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setShowFields(checked);
    onPrePlatedChange(checked); // Update isPrePlated based on checkbox state
  };

  // Handle individual field changes with validation
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const numericValue = Number(value);
    
    if (isNaN(numericValue) || numericValue < 0) return; // Avoid negative or invalid inputs
    
    const updatedFields = { ...fields, [id]: numericValue };
    setFields(updatedFields);
    onFieldsChange(updatedFields);
  };

  return (
    <div className="mt-4">
      {product.isPrePlated && (
        <div>
          <label className="flex items-center space-x-2 w-full">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={showFields} // Use showFields to control the checkbox state
              onChange={handleCheckboxChange}
            />
            <div className="flex items-center space-x-2">
              <SparklesText
                text="Make this Pre Plated Saree only in ₹"
                className="text-base sm:text-xl font-light"
              />
              <span className="font-bold text-base sm:text-xl">
                {product.prePlatedCharges}
              </span>
            </div>
          </label>

          {showFields && (
            <div className="mt-4 space-y-4">
              {/* Waist Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="waist">
                  Waist
                </label>
                <input
                  type="number"
                  id="waist"
                  value={fields.waist}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter waist size"
                  onChange={handleFieldChange}
                />
              </div>
              <Card >
              <p className='py-6 px-6'>Note: As this pre-pleated saree is made with care and love especially for you, 
                we are confident that your choice will give you a moment of sheer elegance, showcasing beautiful craftsmanship! 
                The dispatch time for ready-to-wear sarees is 7 days.For your 1 min saree,
                 only prepaid payment option are available with no returns and exchange.
              </p>
             </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadyToPrePlated;
