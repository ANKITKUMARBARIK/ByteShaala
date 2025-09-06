import { MessageSquare, Send, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  useAddReviewMutation,
  // useGetAllReviewsQuery,
} from "@/actions/courseActions";
import { Button } from "@/components/ui/button";

const WriteReview = ({ isAuthenticated, isOwned, course }) => {
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: "",
  });
  const [addReview, { isLoading: isSubmittingReview }] = useAddReviewMutation();

  // Fetch all reviews from API
  // const { data: reviewsData, isLoading: isLoadingReviews } =
  //   useGetAllReviewsQuery();

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating || !reviewForm.comment.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }

    try {
      await addReview({
        courseId: course._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      }).unwrap();

      toast.success("Review submitted successfully!");
      setReviewForm({ rating: 0, comment: "" });
    } catch (error) {
      const errorMessage =
        error?.data?.error?.message ||
        error?.data?.message ||
        "Failed to submit review";
      toast.error(errorMessage);
    }
  };

  // Handle star rating click
  const handleStarClick = (rating) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  // Get reviews from API data and filter for current course
  const allReviews = course?.reviews || [];

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

  return (
    <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4 sm:mb-6">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg sm:text-xl font-semibold">Student Reviews</h3>
        <span className="text-gray-400 text-sm">({allReviews.length})</span>
      </div>

      {/* Write Review Form - Only for course owners */}
      {isAuthenticated && isOwned && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-base font-medium mb-3 !text-[#0055ff]">
            Write a Review
          </h4>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="focus:outline-none transition-colors duration-150"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewForm.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-400 hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-400">
                  {reviewForm.rating > 0 && `${reviewForm.rating}/5`}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Review
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                placeholder="Share your experience with this course..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                isSubmittingReview ||
                !reviewForm.rating ||
                !reviewForm.comment.trim()
              }
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      )}

      {/* Message for non-owners */}
      {isAuthenticated && !isOwned && (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
          <p className="text-gray-400 text-center text-sm">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Purchase this course to write a review
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {allReviews.length > 0 ? (
          allReviews.map((review, index) => (
            <div
              key={review._id || index}
              className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0"
            >
              {console.log("rrrrrrrr", review)}
              <div className="flex items-start space-x-3">
                {/* User Avatar */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium flex-shrink-0">
                  {getUserInitials(review.userData)}
                </div>

                <div className="flex-1 min-w-0">
                  {/* User Info and Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                    <div className="flex-1">
                      <h6 className="font-medium text-white text-sm">
                        {getFullName(review.userData)}
                      </h6>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-yellow-400 text-xs font-medium">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                    {/* Review Date */}
                    {review.createdAt && (
                      <span className="text-gray-400 text-xs mt-1 sm:mt-0">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Review Comment */}
                  <p className="text-gray-300 text-sm leading-relaxed break-words">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              No reviews yet. Be the first to review this course!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteReview;
