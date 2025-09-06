import { Star } from "lucide-react";

const Testimonials = ({ reviews }) => {
  // Helper function to get user initials
  const getUserInitials = (userData) => {
    if (!userData) return "U";
    const firstName = userData.firstName || "";
    const lastName = userData.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper function to get full name
  const getFullName = (userData) => {
    if (!userData) return "Anonymous User";
    const firstName = userData.firstName || "";
    const lastName = userData.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Anonymous User";
  };

  // Get the latest reviews (limit to 6 for display)
  const displayReviews = reviews?.slice(0, 6) || [];

  return (
    <div>
      <h3 className="text-white mb-6">What Our Students Say</h3>
      {displayReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((review, index) => (
            <div
              key={review._id || index}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {getUserInitials(review.userData)}
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    {getFullName(review.userData)}
                  </h4>
                  <p className="text-gray-400 text-sm">Student</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">No reviews yet</div>
          <p className="text-gray-500 text-sm">
            Be the first to share your experience!
          </p>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
