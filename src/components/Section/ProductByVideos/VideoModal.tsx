import React, { useState } from 'react';
import { ProductType } from '@/Types/data/ProductType';
import { Divider, Image, Spinner } from '@nextui-org/react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { getAuth } from 'firebase/auth';
import CartDrawer from '@/components/Cart/page';
import { handleAddToCart } from '@/utils/handleAddToCart';
import OtpModal from '@/components/Login/PhoneLoginModel';
import { useRouter } from 'next/navigation';

type ProductModalProps = {
  product: ProductType;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

const ProductViewModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const router = useRouter();  // Corrected typo from Rotuer to router
  const auth = getAuth(); // Firebase Auth instance

  const handleCartClick = async () => {
    // Check if the user is logged in
    if (!auth.currentUser) {
      setIsModalOpen(true); // Show OTP modal if the user is not logged in
      return;
    }

    setLoading(true);
    const success = await handleAddToCart(product);
    setLoading(false);

    if (success) {
      console.log('Product added to cart successfully');
      setIsCartDrawerOpen(true);
    } else {
      console.error('Failed to add product to cart');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] h-[90vh] rounded-lg flex overflow-hidden relative">
        {/* Left Section: Video */}
        <div className="w-full md:w-1/2 h-full relative bg-gray-200">
          <video
            key={product.videoUrl} // Ensures React re-renders video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={product.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right Section: Product Details */}
        <div className="hidden md:flex w-1/2 h-full p-6 flex-col">
          {/* Product Features */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold mt-2"></h4>
            <div className="flex gap-2 mt-2">
              {product.galleryImages.map((galleryImage, index) => (
                <Image
                  key={index}
                  src={galleryImage}
                  alt={product.productTitle}
                  height={200}
                  width={200}
                  className="rounded"
                />
              ))}
            </div>
          </div>

          <Divider className="mt-2" />

          {/* Product Header */}
          <div className="mt-3">
            <h2 className="text-1xl text-black font-bold capitalize ">{product.productTitle}</h2>
            <h3 className="text-lg text-gray-500 mt-2 font-serif">{product.productSubtitle}</h3>
            <p className="text-gray-700 text-xl mt-4 font-semibold">₹{product.price}</p>
          </div>
          <Divider className="mt-2" />

          {/* Short Description */}
          <div className="mt-3">
            <h2 className="text-1xl">{product.shortDescription}</h2>
          </div>

          {/* Footer Buttons */}
          <div className="absolute bottom-0 right-0 w-1/2 bg-gray-100 flex justify-evenly py-4">
            <button
              onClick={handleCartClick}
              disabled={loading}
              className="text-white px-6 py-3 rounded font-bold  hover:opacity-90"
              style={{
                backgroundColor: "#FF6A00",
                color: "#000000",
                border: "2px solid #000",
                borderRadius: "4px",
                transition: "background-color 0.3s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D35400';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FF6A00';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {loading ? (
                <Spinner color="white" size="sm" />
              ) : (
                <>
                  Add to Cart <ShoppingCartOutlined />
                </>
              )}
            </button>
            <button className="bg-blue-500 text-white px-6 py-3 rounded font-bold w-1/2 mx-2" onClick={()=>{router.push(`/collection/${product.categories[0]}/product/${product.slug}`)}}>
              More Info
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          className="absolute top-[50%] left-2 transform -translate-y-[50%] bg-gray-800 text-white p-2 rounded-full"
          onClick={onPrevious}
        >
          ◀
        </button>
        <button
          className="absolute top-[50%] right-2 transform -translate-y-[50%] bg-gray-800 text-white p-2 rounded-full"
          onClick={onNext}
        >
          ▶
        </button>

        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-black p-2 rounded-full"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Mobile Footer: Features Image, Product Title and Cart Icon Above Video */}
      <div className="absolute bottom-4 left-0 w-full md:hidden flex flex-col items-center justify-between px-4">
        <div className="flex items-center space-x-3 mb-4 w-full max-w-[380px] rounded-md py-3 bg-white shadow-md">
          {product.galleryImages.slice(0, 1).map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={product.productTitle}
              width={50}
              height={50}
              className="rounded-full"
            />
          ))}
          <span className="text-sm font-semibold pl-2 pr-2 text-gray-800">{product.productTitle}</span>
        </div>

        {/* Cart Icon */}
        <button
          onClick={handleCartClick}
          disabled={loading}
          className="bg-orange-500 text-black px-6 py-3 rounded-full flex items-center justify-center"
          style={{
            border: "2px solid #000",
            transition: "background-color 0.3s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#D35400';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FF6A00';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {loading ? (
            <Spinner color="white" size="sm" />
          ) : (
            <ShoppingCartOutlined style={{ fontSize: "24px" }} />
          )}
        </button>
      </div>

      {/* Conditionally render CartDrawer or OtpModal */}
      {isCartDrawerOpen && (
        <CartDrawer isOpen={isCartDrawerOpen} onOpenChange={setIsCartDrawerOpen} />
      )}
      {isModalOpen && <OtpModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />}
    </div>
  );
};

export default ProductViewModal;
