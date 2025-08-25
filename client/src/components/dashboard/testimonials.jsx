import { Star } from "lucide-react";

// Dummy testimonials data
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Full Stack Developer",
    rating: 5,
    comment:
      "ByteShaala transformed my coding journey! The instructors are amazing and the content is top-notch. Highly recommended for anyone looking to level up their skills.",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Rahul Kumar",
    role: "Software Engineer",
    rating: 5,
    comment:
      "The DSA course helped me crack my dream job at a top tech company. The practical approach and real-world examples made complex concepts easy to understand.",
    avatar: "RK",
  },
  {
    id: 3,
    name: "Anita Patel",
    role: "Frontend Developer",
    rating: 4,
    comment:
      "Excellent platform with great community support. The projects are industry-relevant and the mentorship is outstanding. Worth every penny!",
    avatar: "AP",
  },
];

const Testimonials = () => {
  return (
    <div>
      <h3 className="text-white mb-6">What Our Students Say</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                {testimonial.avatar}
              </div>
              <div>
                <h4 className="text-white font-semibold">{testimonial.name}</h4>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimonial.rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {testimonial.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
