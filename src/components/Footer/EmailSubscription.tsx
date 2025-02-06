import { Input } from "@nextui-org/react";

const EmailSubscription = () => {
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
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-all duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailSubscription;
