import { ProfileForm } from "@/components/profile/profile-form";

const ProfilePage = () => {
  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h3>Profile Settings</h3>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Form */}
        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;
