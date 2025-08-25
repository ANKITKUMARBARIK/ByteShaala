import { Play, ShoppingCart } from "lucide-react";

const CoursePreview = ({
  course,
  handleAddToCart,
  isAddingToCart,
  isOwned = false,
  onWatchNow,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl sticky top-4">
      <div className="relative">
        <img
          src={course?.thumbnail}
          alt={course?.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 rounded-full p-4">
            <Play className="w-8 h-8 text-white fill-current" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {isOwned ? (
          <button
            onClick={onWatchNow}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 mb-3 flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Watch Now</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 mb-3 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
            </button>

            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200">
              Buy Now
            </button>
          </>
        )}

        <div className="mt-4 text-center text-sm text-gray-400">
          30-Day Money-Back Guarantee
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
