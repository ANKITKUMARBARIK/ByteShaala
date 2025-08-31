import { ShoppingCart, FileText, Edit } from "lucide-react";

import { cn } from "@/lib/utils";

const CourseCard = ({
  course,
  buttonText = "View Course",
  className = "",
  onButtonClick,
  showDiscord = false,
  showProgress = true,
  showPricing = false,
  onAddToCart,
  isAddingToCart = false,
  isAdmin = false,
  onEditCourse,
}) => {
  const {
    title,
    thumbnail,
    progress,
    instructor,
    category,
    originalPrice,
    discountPrice,
  } = course;

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-700 flex flex-col h-full",
        className
      )}
    >
      {/* Course Image with Progress */}
      <div className="relative">
        <img src={thumbnail} alt={title} className="w-full h-48 object-cover" />

        {/* Progress Circle - Only show if showProgress is true and progress exists */}
        {showProgress && progress !== undefined && (
          <div className="absolute top-4 right-4">
            <div className="relative w-12 h-12">
              <svg
                className="w-12 h-12 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-gray-600"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-green-400"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${progress}, 100`}
                  strokeLinecap="round"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Card Content - Flexible area that grows */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Content that can vary in height */}
        <div className="flex-grow">
          <h4 className="text-white font-semibold line-clamp-2">{title}</h4>
          {instructor && (
            <p className="text-gray-400 text-sm mb-4">{instructor}</p>
          )}

          {/* Pricing - Only show if showPricing is true */}
          {showPricing && originalPrice && discountPrice && (
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm line-through">
                  ₹{originalPrice}
                </span>
                <span className="text-white text-lg font-bold">
                  ₹{discountPrice}
                </span>
              </div>
              <div className="text-green-400 text-xs font-medium mt-1">
                {Math.round(
                  ((originalPrice - discountPrice) / originalPrice) * 100
                )}
                % OFF
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Always at bottom */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <button
            onClick={() => onButtonClick?.(course)}
            className="flex-1 !bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {buttonText}
          </button>

          {/* Admin Edit Button - Only show if isAdmin is true */}
          {isAdmin && onEditCourse && (
            <button
              onClick={() => onEditCourse(course)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Course
            </button>
          )}

          {/* Add to Cart Button - Only show if onAddToCart is provided and not admin */}
          {!isAdmin && onAddToCart && (
            <button
              onClick={() => onAddToCart(course)}
              disabled={isAddingToCart}
              className={cn(
                "flex-1 btn-primary px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2",
                isAddingToCart
                  ? "bg-sky-400 cursor-not-allowed opacity-75"
                  : "bg-sky-500 hover:bg-sky-600"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
          )}

          {showDiscord && (
            <button className="flex-1 bg-transparent border border-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Join Discord
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
