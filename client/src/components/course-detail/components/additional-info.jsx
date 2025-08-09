import { Award, CheckCircle, Clock, Globe } from "lucide-react";

const AdditionalInfo = ({ course }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Course includes:</h3>
      <div className="space-y-3 text-gray-300">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-blue-400" />
          <span>{course?.duration} on-demand video</span>
        </div>
        <div className="flex items-center space-x-3">
          <Award className="w-5 h-5 text-blue-400" />
          <span>Certificate of completion</span>
        </div>
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-blue-400" />
          <span>Access on mobile and TV</span>
        </div>
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-blue-400" />
          <span>Full lifetime access</span>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
