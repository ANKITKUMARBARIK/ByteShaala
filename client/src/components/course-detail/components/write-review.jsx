import { MessageSquare, Send, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

// Mock reviews data (in real app, this would come from course.reviews)
const mockReviews = [
  {
    id: 1,
    user: {
      name: "Priya Sharma",
      avatar: "PS",
    },
    rating: 5,
    comment:
      "Excellent course! The instructor explains complex concepts in a very simple way. Highly recommended for beginners and intermediate learners.",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    user: {
      name: "Rahul Kumar",
      avatar: "RK",
    },
    rating: 4,
    comment:
      "Great content and practical examples. The course structure is well organized. Would love to see more advanced topics covered.",
    createdAt: "2024-01-10T14:20:00Z",
  },
  {
    id: 3,
    user: {
      name: "Anita Patel",
      avatar: "AP",
    },
    rating: 5,
    comment:
      "This course changed my career! The hands-on projects and real-world examples helped me land my dream job. Thank you!",
    createdAt: "2024-01-05T09:15:00Z",
  },
];

const WriteReview = ({ isAuthenticated, isOwned, course }) => {
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating || !reviewForm.comment.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }

    setIsSubmittingReview(true);
    try {
      // Here you would call your review submission API
      // await submitReview({ courseId: course._id, ...reviewForm }).unwrap();

      // For now, just show success message
      toast.success("Review submitted successfully!");
      setReviewForm({ rating: 0, comment: "" });
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle star rating click
  const handleStarClick = (rating) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  // Use mock reviews or actual course reviews
  const reviews = course?.reviews || mockReviews;

  return (
    <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4 sm:mb-6">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg sm:text-xl font-semibold">Student Reviews</h3>
        <span className="text-gray-400 text-sm">({reviews.length})</span>
      </div>

      {/* Write Review Form - Only for course owners */}
      {isAuthenticated && isOwned && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-base font-medium mb-3 !text-[#0055ff]">
            Write a Review
          </h4>
          <form onSubmit={handleReviewSubmit} className="space-y-3">
            {/* Star Rating */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Your Rating *
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="focus:outline-none transition-colors p-1"
                  >
                    <Star
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        star <= reviewForm.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-400 hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
                {reviewForm.rating > 0 && (
                  <span className="ml-2 text-gray-400 text-xs">
                    {reviewForm.rating} star{reviewForm.rating > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Your Review *
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
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
                required
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2 px-4 h-auto"
            >
              <Send className="w-3 h-3 mr-2" />
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      )}

      {/* Authentication message for non-owners */}
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
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start space-x-3">
                {/* User Avatar */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium flex-shrink-0">
                  {review.user.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  {/* User Info and Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-white text-sm">
                        {review.user.name}
                      </h5>
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
                    <span className="text-gray-500 text-xs mt-1 sm:mt-0 sm:ml-4 flex-shrink-0">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
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
          <div className="text-center py-6">
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-3" />
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
