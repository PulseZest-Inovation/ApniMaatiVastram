'use client';
import React, { useEffect, useState } from "react";
import { Card } from "@nextui-org/react";
import { FaPercent, FaClipboard } from "react-icons/fa";
import { useSwipeable } from "react-swipeable";
import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
import { toast } from "react-toastify"; // Importing toast for a better notification


interface Coupon {
  couponTitle: string;
  couponSubtitle: string;
  code: string;
  productsId : string[];
  productCategories: string[];
}

interface DiscountCardProps{
  productId : string;
  categories : string[];
}

const DiscountCard: React.FC<DiscountCardProps> = ({productId, categories}) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // To keep track of the current slide

  useEffect(() => {
    const fetchCoupons = async () => {
      const fetchedCoupons = await getAllDocsFromCollection<Coupon>("coupons");
      const applicableCoupons = fetchedCoupons.filter((coupon) => {
        const { productsId = [], productCategories = [] } = coupon;
        // Check if coupon applies to this product by ID
        const productMatch = productsId
          .map(id => id.toLowerCase())
          .includes(productId.toLowerCase());
        // Check if coupon applies to this product by category
        const categoryMatch =
          Array.isArray(categories) &&
          productCategories
            .map(cat => cat.trim().toLowerCase())
            .some(couponCat =>
              categories.map(c => c.trim().toLowerCase()).includes(couponCat)
            );

            // Return only if either matches
            return productMatch || categoryMatch;
      });

      setCoupons(applicableCoupons);
    };

    fetchCoupons();
  }, [productId, categories]);

  const handleCopyCouponCode = (couponCode: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(couponCode)
        .then(() => {
          toast.success(`Coupon Code "${couponCode}" copied!`, {
            position: "top-center",
            autoClose: 3000,
            style: {
              backgroundColor: "#000000", // Black background
              color: "#FFA500", // Orange text color
              border: "1px solid #FFA500", // Orange border
            },
          });
        })
        .catch(err => {
          console.error("Failed to copy coupon code: ", err);
          toast.error("Failed to copy coupon code.", {
            position: "top-center",
            autoClose: 3000,
            style: {
              backgroundColor: "#000000", // Black background
              color: "#FF6347", // Red text color for error
              border: "1px solid #FF6347", // Red border for error
            },
          });
        });
    } else {
      console.error("Clipboard API not supported");
      toast.error("Clipboard API is not supported.", {
        position: "top-center",
        autoClose: 3000,
        style: {
          backgroundColor: "#000000", // Black background
          color: "#FF6347", // Red text color for error
          border: "1px solid #FF6347", // Red border for error
        },
        });
    }
  };

  // Swipeable handler to go to next/previous coupon
  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prevIndex) => (prevIndex + 1) % coupons.length),// Go to next slide
    onSwipedRight: () => setCurrentIndex((prevIndex) => (prevIndex - 1 + coupons.length) % coupons.length),// Go to previous slide
  });

  return (
    <div className="w-full">
      {coupons.length > 0 ? (
        <div {...handlers} className="relative">
          <div className="flex overflow-hidden w-full">
              {/* Card 1 */}
            <Card
              className="cursor-pointer"
              style={{
                width: "100%",
                marginRight: "8px", // Space between the cards
              }}
              onClick={() => handleCopyCouponCode(coupons[currentIndex].code)} // Copy coupon code when card clicked
            >
              <div className="flex items-center space-x-4 mt-6">
                <FaPercent
                  size={24}
                  color="#FFB800"
                  className="glowing-icon" // Class for glowing effect
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">{coupons[currentIndex].couponTitle}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-600">{coupons[currentIndex].couponSubtitle}</p>
                    <FaClipboard
                      size={18}
                      color="#4CAF50"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering card click event
                        handleCopyCouponCode(coupons[currentIndex].code);
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {coupons.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full ${currentIndex === index ? "bg-blue-500" : "bg-gray-400"}`}
                onClick={() => setCurrentIndex(index)} // Navigate directly to a slide
              />
            ))}
          </div>
        </div>
      ) : (
        <p>No coupons available</p>
      )}
    </div>
  );
};

export default DiscountCard;
