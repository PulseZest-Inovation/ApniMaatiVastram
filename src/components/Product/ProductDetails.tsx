"use client";
import React, { useState } from "react";
import { Button, Spinner } from "@nextui-org/react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { ProductType } from "@/Types/data/ProductType";
import { HeartTwoTone } from "@ant-design/icons";
import { handleAddToCart } from "@/utils/handleAddToCart";
import { handleAddToWishlist } from "@/utils/handleAddToWishlist";
import { getAuth } from "firebase/auth";
import CartDrawer from "../Cart/page";
import OtpModal from "@/components/Login/PhoneLoginModel";
import DiscountCard from "../DiscountCard/page";
import ReadyToWear from "./ReadyToWear";
import ProductShortDescription from "./ProductShortDescription";
import ExpandableSection from "./ExpandableSection";
import ProductCard from "./ProductCard";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import ReadyToPrePlated from "./ReadyToPreplated";
import ProductGuide from "./ProductGuide";

interface ProductDetailsProps {
  product: ProductType;
  selectedVariation?: any; //  Selected variation from parent
  onColorSelect?: (variation: any) => void; //  handler to select variation
  onSizeSelect?:(size:string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product,selectedVariation, onColorSelect, onSizeSelect }) => {
  const [loading, setLoading] = useState({ cart: false, wishlist: false });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readyToWear, setReadyToWear] = useState<{
    length: number;
    waist: number;
    hip: number;
  }>({
    waist: 0,
    length: 0,
    hip: 0,
  });
  const [isReadyToWear, setIsReadyToWear] = useState(false); // Track the ReadyToWear state
  const [isPrePlated, setIsPrePlated] = useState(false);

  const auth = getAuth(); // Get Firebase authentication instance

  const handleCustomizationChange = (
    fields: { waist: number } | { waist: number; length: number; hip: number }
  ) => {
    if ("length" in fields && "hip" in fields) {
      // Handle full customization (ReadyToWear)
      setReadyToWear((prevState) => ({
        ...prevState,
        ...fields, // Spread the fields object to update the state
      }));
    } else {
      // Handle only waist change (ReadyToPrePlated)
      setReadyToWear((prevState) => ({
        ...prevState,
        waist: fields.waist, // Update only the waist value
      }));
    }
  };

  const handleReadyToWearChange = (isReadyToWear: boolean) => {
    setIsReadyToWear(isReadyToWear);
  };

  const handlePrePlateToChange = (isPrePlated: boolean) => {
    setIsPrePlated(isPrePlated);
  };
  //  Determine the stock to check (variation first, then main product)
  const stockToCheck = Number(selectedVariation?.product_stock ?? product.stockQuantity);

  const handleCartClick = async () => {
    // Check if the user is logged in
    if (!auth.currentUser) {
      setIsModalOpen(true); // Show OTP modal if the user is not logged in
      return;
    }

    setLoading((prev) => ({ ...prev, cart: true }));

    // Pass isReadyToWear state along with the product and readyToWear fields
    const success = await handleAddToCart({
      ...product,
       variations: {
    ...selectedVariation,
    //  override image here and size
    selectedSize: selectedVariation?.selectedSize,
    image: selectedVariation?.image || product.featuredImage,
  },
  price: selectedVariation?.price || product.price,
  image: selectedVariation?.image || product.featuredImage, //  also send main image
      readyToWear,
      isReadyToWear,
      isPrePlated,
    });

    setLoading((prev) => ({ ...prev, cart: false }));

    if (success) {
      console.log("Product added to cart successfully");
      setIsCartDrawerOpen(true); 

      
    // **Track "Purchase" event in Facebook Pixel**
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Purchase", {
        value: product.price || 100, // Ensure you're tracking the actual price
        currency: "INR", // Change this based on your store's currency
      });
    }


    } else {
      console.error("Failed to add product to cart");
    }
  };

  const handleWishlistClick = async () => {
    setLoading((prev) => ({ ...prev, wishlist: true }));
  
    // const success = await handleAddToWishlist(product);
     // Decide which data to use
  const source = selectedVariation || product;

  const price = source.price ? Number(source.price) : 0;
  const salePrice = source.salePrice
    ? Number(source.salePrice)
    : price; // fallback to price if empty
  const regularPrice = source.regularPrice
    ? Number(source.regularPrice)
    : price; // fallback to price if empty

    //  Merge selectedVariation data before sending
  const productWithVariation = {
    ...product,
    price,
    salePrice,
    regularPrice,
    image: selectedVariation?.image || product.featuredImage,
    variation: selectedVariation || null,
  };

    const success = await handleAddToWishlist(productWithVariation);
  
    setLoading((prev) => ({ ...prev, wishlist: false }));
  
    if (success) {
      console.log("Product added to wishlist successfully");
      // **Track "AddToWishlist" event in Facebook Pixel**
      try {
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "AddToWishlist", {
            content_name: product.productTitle,
            content_ids: [product.id],
            value: product.price || 100, // Ensure correct price
            currency: "INR",
          });
        }
      } catch (err) {
        console.error("Facebook Pixel tracking failed:", err);
      }
  
    } else {
      console.error("Failed to add product to wishlist");
    }
  };
  

  const rating = parseFloat(product.averageRating);

  // Only render rating if it's a valid number and not 0
  const shouldShowRating = !isNaN(rating) && rating > 0;

  return (
    <div className="relative flex flex-col md:space-y-1">
      {/* Product title */}
      <h1
        className="text-4xl font-bold capitalize break-words font-sans"
        style={{
          wordBreak: "break-word",
          whiteSpace: "normal",
        }}
      >
        {product.productTitle}
      </h1>

      {/* Product subtitle */}
      <h2
        className="text-2xl  capitalize break-words font-medium mt-2 font-sans"
        style={{
          wordBreak: "break-word",
          whiteSpace: "normal",
          lineHeight: "1.2",
        }}
      >
        {product.productSubtitle}
      </h2>

      {/* Display rating section only if the rating is valid */}
      {shouldShowRating && (
        <div className="flex items-center">
          {/* Full stars */}
          {Array.from({ length: Math.floor(rating) }).map((_, index) => (
            <FaStar key={`full-${index}`} className="text-yellow-400" />
          ))}

          {/* Half star */}
          {rating % 1 >= 0.5 && <FaStarHalfAlt className="text-yellow-400" />}

          {/* Empty stars */}
          {Array.from({
            length: 5 - Math.floor(rating) - (rating % 1 >= 0.5 ? 1 : 0),
          }).map((_, index) => (
            <FaRegStar key={`empty-${index}`} className="text-yellow-400" />
          ))}
        </div>
      )}

      {/* Price Section */}
      <div className="mt-2">
        <div className="flex items-center space-x-4">
          {product.regularPrice && (
            <span className="text-xl text-gray-500 line-through">
              ₹{product.regularPrice}
            </span>
          )}
          {/* <span className="text-3xl font-bold ">₹{product.price}</span> */}
             {/* add variation price */}
          <span className="text-3xl font-bold ">₹{selectedVariation?.price || product.price}</span> 
        </div>
        <p className="text-1xl text-gray-500 capitalize font-thin">
          Inclusive of All Taxes
        </p>

        {/* Out of Stock Message */}
        {/* {product.stockQuantity <= 0 && (
          <p className="text-red-600 font-bold mt-2">Out of Stock</p>
        )} */}
        {stockToCheck <= 0 && <p className="text-red-600 font-bold mt-2 ">Out of Stock</p>}
      </div>
      {/* Variation Selection */}
      {product.variations && product.variations.length > 0 && (
        <div className="mt-4 space-y-3">
          {/*  Colors */}
          <div>
            <p className="font-semibold mb-1">Color</p>
            <div className="flex gap-2 flex-wrap">
              {product.variations.map((v, idx) => {
                const isSelected =
                  selectedVariation?.color?.[0]?.toLowerCase() ===
                  v.color?.[0]?.toLowerCase();

                return (
                  <button
                    key={idx}
                    className={`px-3 py-1 rounded border transition ${
                      isSelected
                        ? "border-black bg-black text-white font-bold"
                        : "border-gray-300 hover:border-black"
                    }`}
                    onClick={() => {
                      //  Toggle selection: if same color clicked again, deselect
                      if (isSelected) {
                        onColorSelect?.(null); // Unselect → goes back to featured image
                      } else {
                        onColorSelect?.(v); // Select new color → show its image
                      }
                    }}
                  >
                    {v.color?.[0] || "—"}
                  </button>
                );
              })}
            </div>
          </div>
      {/*  SIZE SELECTION */}
      {(() => {
        const sizesArray: string[] =
          selectedVariation?.size == null
            ? []
            : Array.isArray(selectedVariation.size)
            ? selectedVariation.size
            : [String(selectedVariation.size)];

        if (sizesArray.length === 0) return null;

        return (
          <div>
            <p className="font-semibold mb-2">Size</p>
            <div className="flex gap-2 flex-wrap">
              {sizesArray.map((sz: string) => (
                <button
                  key={sz}
                  className={`px-3 py-1 border rounded ${
                    selectedVariation?.selectedSize === sz
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                  onClick={() => onSizeSelect?.(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        );
      })()}
          {/*  Weight */}
          <div>
            <p className="font-semibold mb-1">Weight</p>
            <div>{selectedVariation?.weight || "N/A"} kg</div>
          </div>
        </div>
      )}
      <ProductGuide Product={product} />

      <ReadyToWear
        product={product}
        onFieldsChange={handleCustomizationChange}
        onReadyToWearChange={handleReadyToWearChange}
      />
      <ReadyToPrePlated
        product={product}
        onFieldsChange={handleCustomizationChange}
        onPrePlatedChange={handlePrePlateToChange}
      />

      <ProductCard product={product} />

      <DiscountCard />

      {/* Sticky Footer for Action Buttons (Mobile Only) */}
      {stockToCheck > 0 && (
        <div className="p-4 bg-white flex flex-col md:flex-row md:space-x-2 space-y-4 md:space-y-0 md:items-center md:static fixed bottom-0 left-0 right-0 z-10">
          <Button
            endContent={
              loading.cart ? (
                <Spinner color="white" size="sm" />
              ) : (
                <ShoppingCartOutlined />
              )
            }
            className="px-6 py-2 text-white hover:opacity-90"
            style={{
              backgroundColor: "#FF6A00",
              color: "#000000",
              border: "2px solid #000",
              borderRadius: "4px",
              transition: "background-color 0.3s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#D35400";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FF6A00";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onPress={handleCartClick}
            disabled={loading.cart} // Disable button while loading
          >
            <p className="capitalize" style={{ letterSpacing: "0.2em" }}>
              {loading.cart ? "Processing..." : "ADD TO CART"}
            </p>
          </Button>

          <Button
            endContent={
              loading.wishlist ? (
                <Spinner color="white" size="sm" />
              ) : (
                <HeartTwoTone twoToneColor="#eb2f96" />
              )
            }
            className="px-6 py-2 text-white"
            style={{
              backgroundColor: "#c9c6bb",
              color: "#000000",
              borderRadius: "4px",
              border: "none",
            }}
            onPress={handleWishlistClick}
            disabled={loading.wishlist} // Disable button while loading
          >
            {loading.wishlist ? "Processing..." : "W h i s h l i s t"}
          </Button>
        </div>
      )}

      {[
        "Details",
        "Description ",
        "Shipping",
        "Return & Exchange",
        "Manufacturing Information ",
        "Support",
      ].map((section) => (
        <ExpandableSection
          key={section}
          title={section}
          content={
            product.description.find(
              (d) => d.heading.toLowerCase() === section.toLowerCase()
            )?.content || "<p>Content not available.</p>"
          }
        />
      ))}

      {/* Short Description */}
      <ProductShortDescription
        description={product.shortDescription}
      ></ProductShortDescription>

      {/* Conditionally render CartDrawer or OtpModal */}
      {isCartDrawerOpen && (
        <CartDrawer
          isOpen={isCartDrawerOpen}
          onOpenChange={setIsCartDrawerOpen}
        />
      )}

      {isModalOpen && (
        <OtpModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      )}
    </div>
  );
};

export default ProductDetails;
