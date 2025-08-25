import { Award, BookOpen, Calendar, TrendingUp } from "lucide-react";

// Recent activities data
const recentActivities = [
  {
    id: 1,
    type: "course",
    title: "New Course Explored",
    description: "Checked out 'React Advanced Patterns'",
    time: "2 hours ago",
    icon: BookOpen,
    color: "text-blue-400",
  },
  {
    id: 2,
    type: "achievement",
    title: "Achievement Unlocked",
    description: "Completed 'JavaScript Fundamentals' module",
    time: "1 day ago",
    icon: Award,
    color: "text-yellow-400",
  },
  {
    id: 3,
    type: "activity",
    title: "Learning Streak",
    description: "7 days consecutive learning streak",
    time: "2 days ago",
    icon: TrendingUp,
    color: "text-green-400",
  },
  {
    id: 4,
    type: "schedule",
    title: "Upcoming Session",
    description: "Live coding session scheduled for tomorrow",
    time: "3 days ago",
    icon: Calendar,
    color: "text-purple-400",
  },
];

const RecentActivity = () => {
  return (
    <div>
      <h3 className="text-white mb-6">Recent Activity</h3>
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        {recentActivities.map((activity, index) => (
          <div
            key={activity.id}
            className={`p-4 ${index !== recentActivities.length - 1 ? "border-b border-gray-700" : ""}`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg bg-gray-700 ${activity.color}`}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">{activity.title}</h4>
                <p className="text-gray-400 text-sm">{activity.description}</p>
                <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
