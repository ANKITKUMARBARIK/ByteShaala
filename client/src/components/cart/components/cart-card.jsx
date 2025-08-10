import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const CartCard = ({ course, handleRemoveFromCart }) => {
  return (
    <div
      key={course?._id}
      className="bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row gap-6"
    >
      {/* Course Image */}
      <div className="md:w-48 flex-shrink-0">
        <img
          src={course?.thumbnail}
          alt={course?.title}
          className="w-full h-32 md:h-28 object-cover rounded-lg"
        />
      </div>

      {/* Course Details */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <Link
              to={`/courses/${course?.slug}`}
              className="text-lg font-semibold text-white hover:text-blue-400 transition-colors line-clamp-2"
            >
              {course?.title}
            </Link>
            <p className="text-gray-400 text-sm mt-1">
              By {course?.instructor}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
              <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                {course?.category}
              </span>
              <span>{course?.level}</span>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col items-end space-y-3">
            <div className="text-right">
              <div className="text-xl font-bold text-white">
                ₹{course?.price?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400 line-through">
                ₹{course?.originalPrice?.toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => handleRemoveFromCart(course?._id)}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
