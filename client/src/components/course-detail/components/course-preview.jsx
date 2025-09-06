import { Play, ShoppingCart, Edit, Trash2 } from "lucide-react";

const CoursePreview = ({
  course,
  handleAddToCart,
  isAddingToCart,
  isOwned = false,
  onWatchNow,
  isAdmin = false,
  onEditCourse,
  onDeleteCourse,
  onBuyNow,
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
        {/* Admin Price Display */}
        {isAdmin && (
          <div className="mb-6 bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium !text-[#0055ff] mb-2">
              Pricing Information
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Current Price:</span>
                <span className="text-lg font-semibold text-white">
                  ₹{course?.price?.toLocaleString()}
                </span>
              </div>
              {course?.originalPrice &&
                course?.originalPrice > course?.price && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        Original Price:
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{course?.originalPrice?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Discount:</span>
                      <span className="text-sm text-green-400 font-medium">
                        {Math.round(
                          ((course?.originalPrice - course?.price) /
                            course?.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    </div>
                  </>
                )}
            </div>
          </div>
        )}

        {isAdmin ? (
          // Admin buttons
          <div className="space-y-3">
            <button
              onClick={() => onEditCourse?.(course)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Edit className="w-5 h-5" />
              <span>Edit Course</span>
            </button>

            <button
              onClick={() => onDeleteCourse?.(course)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Course</span>
            </button>
          </div>
        ) : isOwned ? (
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

            <button
              onClick={() => {
                onBuyNow(course?._id);
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
            >
              Buy Now
            </button>
          </>
        )}

        {!isAdmin && (
          <div className="mt-4 text-center text-sm text-gray-400">
            30-Day Money-Back Guarantee
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePreview;
