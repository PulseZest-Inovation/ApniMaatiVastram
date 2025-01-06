import React from 'react'
import { Card } from '@nextui-org/react';

export default function CheckoutProductReview() {
  return (
         
<div className="hidden md:block md:w-1/3 p-4 md:sticky  top-4">
        <h3 className="text-lg font-bold mb-4">Order Summary</h3>
        <Card className="space-y-4 p-4">
          {/* Example Products */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-semibold">Product Name</p>
              <p className="text-sm text-gray-500">Quantity: 1</p>
            </div>
            <p className="font-semibold">$100</p>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-semibold">Another Product</p>
              <p className="text-sm text-gray-500">Quantity: 2</p>
            </div>
            <p className="font-semibold">$200</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="font-semibold">Total</p>
            <p className="font-semibold">$300</p>
          </div>
        </Card>
      </div>
  )
}
