import { CreditCard } from "lucide-react";

const CartSummary = ({ totalPrice, totalOriginalPrice, totalSavings }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
        <h3 className="text-xl font-bold mb-6">Order Summary</h3>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-gray-300">
            <span>Original Price:</span>
            <span>₹{totalOriginalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-green-400">
            <span>Savings:</span>
            <span>-₹{totalSavings.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 mb-3 flex items-center justify-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Proceed to Checkout</span>
        </button>

        <div className="text-center text-sm text-gray-400">
          30-Day Money-Back Guarantee
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className="font-semibold mb-3">Promotions</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
