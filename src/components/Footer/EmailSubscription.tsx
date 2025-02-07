import { useState } from "react";
import { Input } from "@nextui-org/react";
import { setDocWithCustomId } from "@/service/Firebase/postFirestore";
import { serverTimestamp } from "firebase/firestore";

const EmailSubscription = () => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter a valid email.");
      setShowModal(true);
      return;
    }

    const docId = email.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize email for Firestore doc ID

    const success = await setDocWithCustomId("subscribers", docId, {
      email,
      subscribeDate: serverTimestamp(), // Firebase Server Timestamp
    });

    if (success) {
      setMessage("Thank you for subscribing to our newsletter!");
    } else {
      setMessage("Failed to subscribe. Please try again later.");
    }
    setShowModal(true);
  };

  return (
    <div className="w-full sm:w-1/2">
      <h3 className="text-lg font-semibold mb-4">Subscribe to Newsletter</h3>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="flex items-center space-x-4">
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            className="w-3/4 sm:w-2/3 flex-grow shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="button"
            className="bg-black text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-all duration-300"
            onClick={handleSubscribe}
          >
            Send
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>{message}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailSubscription;
