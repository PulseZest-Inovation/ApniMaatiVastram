import React from "react";
import { Card } from "@nextui-org/react";
import { FaPercent } from "react-icons/fa"; // Importing the percentage icon

const DiscountCard: React.FC = () => {
  return (
    <Card
    className=" cursor-pointer"
      style={{
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "#F5F5F5", // Light background color for the card
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Light shadow for a glowing effect
        borderRadius: "8px", // Rounded corners
        display: "flex",
        alignItems: "center", // Align items in a single row
        justifyContent: "flex-start", // Align content to the left
      }}
    >
      <div className="flex items-center space-x-4">
        <FaPercent
          size={24}
          color="#FFB800"
          className="glowing-icon" // Class for glowing effect
        />
        <div>
          <p className="text-lg font-semibold text-gray-800">Get 10% Off</p>
          <p className="text-sm text-gray-600">On your First order</p>
        </div>
      </div>

      <style jsx>{`
        .glowing-icon {
          transition: filter 0.3s ease;
        }

        .glowing-icon:hover {
          text-shadow: 0 0 15px rgba(255, 184, 0, 1), 0 0 30px rgba(255, 184, 0, 0.6);
          filter: brightness(1.5);
        }
      `}</style>
    </Card>
  );
};

export default DiscountCard;
