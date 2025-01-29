'use client';
import React, { useState } from 'react';
import SparklesText from '../ui/sparkles-text';

// Define the type for the product object
interface Product {
  isReadyToWear: boolean;
  readyToWearCharges: number;
}

// Define the props for the component
interface CustomFieldsProps {
  product: Product;
  onFieldsChange: (fields: { waist: number; length: number; hip: number }) => void;
  onReadyToWearChange: (isReadyToWear: boolean) => void; 
}

const ReadyToWear: React.FC<CustomFieldsProps> = ({ product, onFieldsChange, onReadyToWearChange }) => {
  const [showFields, setShowFields] = useState(false);
  const [fields, setFields] = useState({ waist: 0, length: 0, hip: 0 });

  // Handle checkbox toggle
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setShowFields(checked);
    onReadyToWearChange(checked); // Update isReadyToWear based on checkbox state
  };

  // Handle individual field changes
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (isNaN(Number(value)) || Number(value) < 0) return; // Avoid negative values or invalid input
    const updatedFields = { ...fields, [id]: Number(value) };
    setFields(updatedFields);
    onFieldsChange(updatedFields);
  };

  return (
    <div className="">
      {product.isReadyToWear && (
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
                text="Make this Ready to Wear only in ₹"
                className="text-base sm:text-xl font-light"
              />
              <span className="font-bold text-base sm:text-xl">
                {product.readyToWearCharges}
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

              {/* Length Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="length">
                  Length
                </label>
                <input
                  type="number"
                  id="length"
                  value={fields.length}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter length"
                  onChange={handleFieldChange}
                />
              </div>

              {/* Hip Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="hip">
                  Hip
                </label>
                <input
                  type="number"
                  id="hip"
                  value={fields.hip}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hip size"
                  onChange={handleFieldChange}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadyToWear;
