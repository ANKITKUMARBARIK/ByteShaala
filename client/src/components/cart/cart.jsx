import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import CartCard from "./components/cart-card";
import CartSummary from "./components/cart-summary";

import {
  // useGetCartQuery,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "../../actions/cartActions";
import { allCourses } from "../../components/courses/data";

const CartSection = () => {
  // const { data: cartData, isLoading, error } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();

  // Mock cart data for development (replace with actual API data)
  const mockCartItems = [
    { courseId: 1, addedAt: new Date().toISOString() },
    { courseId: 2, addedAt: new Date().toISOString() },
    { courseId: 3, addedAt: new Date().toISOString() },
  ];

  const cartItems = mockCartItems;
  const isLoading = false; // Set to false for demo

  // Get course details for cart items
  const cartCourses = cartItems
    .map((item) => {
      const course = allCourses.find((c) => c.id === item.courseId);
      return { ...course, addedAt: item.addedAt };
    })
    .filter(Boolean);

  const totalPrice = cartCourses.reduce(
    (sum, course) => sum + (course.discountPrice || 0),
    0
  );
  const totalOriginalPrice = cartCourses.reduce(
    (sum, course) => sum + (course.originalPrice || 0),
    0
  );
  const totalSavings = totalOriginalPrice - totalPrice;

  const handleRemoveFromCart = async (courseId) => {
    try {
      await removeFromCart(courseId).unwrap();
      toast.success("Course removed from cart");
    } catch (error) {
      toast.error("Failed to remove course from cart");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/courses"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
          <h3 className="flex items-center space-x-3">
            <ShoppingBag className="w-8 h-8" />
            <span>Shopping Cart</span>
          </h3>
        </div>

        {cartCourses.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-300 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-8">
              Discover amazing courses and add them to your cart
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              <span>Browse Courses</span>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {cartCourses.length} Course
                  {cartCourses.length !== 1 ? "s" : ""} in Cart
                </h3>
                {cartCourses.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {cartCourses.map((course) => (
                <CartCard
                  key={course.id}
                  course={course}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              ))}
            </div>

            {/* Cart Summary */}
            <CartSummary
              totalPrice={totalPrice}
              totalOriginalPrice={totalOriginalPrice}
              totalSavings={totalSavings}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSection;
