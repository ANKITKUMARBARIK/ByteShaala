import { yupResolver } from "@hookform/resolvers/yup";
import { Camera, User, Lock, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

import {
  useGetUserProfileQuery,
  useUpdateAccountMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
} from "@/actions/profileActions";
import CommonInput from "@/components/common/common-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Validation schemas
const profileSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must be less than 30 characters")
    .matches(/^[A-Za-z\s]+$/, "First name can only contain letters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must be less than 30 characters")
    .matches(/^[A-Za-z\s]+$/, "Last name can only contain letters"),
  //   phoneNumber: yup
  //     .string()
  //     .required("Phone number is required")
  //     .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please enter a valid phone number"),
  //   gender: yup.string().required("Gender is required"),
});

const passwordSchema = yup.object({
  oldPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export function ProfileForm({ className, ...props }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const fileInputRef = useRef(null);

  // API hooks
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetUserProfileQuery();
  //   const { data: userData, isLoading: userLoading } = useGetCurrentUserQuery();
  const [updateAccount, { isLoading: updateLoading }] =
    useUpdateAccountMutation();
  const [changePassword, { isLoading: passwordLoading }] =
    useChangePasswordMutation();
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

  const user = userData?.data || userData;

  // Profile form - Initialize with empty values first, then update when user data loads
  const profileMethods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      //   phoneNumber: "",
      //   gender: "",
    },
    resolver: yupResolver(profileSchema),
    mode: "onBlur",
  });

  // Password form
  const passwordMethods = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: yupResolver(passwordSchema),
    mode: "onBlur",
  });

  // Update form values when user data loads
  useEffect(() => {
    if (user && !userLoading) {
      profileMethods.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        // phoneNumber: user.phoneNumber || "",
        // gender: user.gender || "",
      });
    }
  }, [user, userLoading, profileMethods]);

  // Handle avatar selection
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  // Handle profile update
  const handleProfileSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Create payload object with only the fields the backend expects
      const payloadObj = {
        firstName: data.firstName,
        lastName: data.lastName,
      };

      // Append payload as JSON string (as expected by backend)
      formData.append("payloadObj", JSON.stringify(payloadObj));

      // Append avatar if selected
      if (selectedAvatar) {
        formData.append("avatar", selectedAvatar);
      }

      const result = await updateAccount(formData).unwrap();
      toast.success("Profile updated successfully!");

      // Reset avatar selection after successful update
      setSelectedAvatar(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  // Handle password change
  const onPasswordSubmit = async (data) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      passwordMethods.reset();
    } catch (error) {
      console.error("Password change error:", error);
      const errorMsg =
        error?.data?.message ||
        error?.data?.error?.message ||
        "Failed to change password";
      toast.error(errorMsg);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await deleteUser().unwrap();
        toast.success("Account deleted successfully!");
        // Redirect to login or home page
        window.location.href = "/login";
      } catch (error) {
        console.error("Account deletion error:", error);
        toast.error(error?.data?.message || "Failed to delete account");
      }
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)} {...props}>
      {/* Profile Header */}
      <div className="rounded-lg pl-6 mb-6">
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div
              onClick={handleAvatarClick}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-md font-bold cursor-pointer hover:opacity-80 transition-opacity relative overflow-hidden"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                getUserInitials()
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* User Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-gray-400 mb-2">{user?.email}</p>
            <p className="text-sm text-gray-500">
              Click on avatar to change profile picture
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex border-gray-70 bg-transparent gap-2 mb-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={cn(
                "flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center space-x-2 rounded-none",
                activeTab === "profile"
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              )}
            >
              <User className="w-4 h-4" />
              <span>Profile Details</span>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={cn(
                "flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center space-x-2",
                activeTab === "password"
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              )}
            >
              <Lock className="w-4 h-4" />
              <span>Change Password</span>
            </button>
          </div>
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <FormProvider {...profileMethods}>
              <form
                onSubmit={profileMethods.handleSubmit(handleProfileSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CommonInput
                    name="firstName"
                    label="First Name"
                    placeholder="Enter your first name"
                    required
                  />
                  <CommonInput
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
                <CommonInput
                  name="email"
                  label="Email Address"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="opacity-60"
                  placeholder="Email cannot be changed"
                />
                {/* <CommonInput
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  disabled
                  required
                /> */}
                {/* gender */}
                {/* <div className="space-y-2 w-fit">
                  <label className="block text-sm font-medium text-gray-300">
                    Gender <span className="text-red-400">*</span>
                  </label>
                  <select
                    {...profileMethods.register("gender")}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {profileMethods.formState.errors.gender && (
                    <p className="text-red-400 text-sm">
                      {profileMethods.formState.errors.gender.message}
                    </p>
                  )}
                </div> */}
                <div className="flex justify-between items-center pt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>
                      {deleteLoading ? "Deleting..." : "Delete Account"}
                    </span>
                  </Button>

                  <Button
                    type="submit"
                    disabled={updateLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {updateLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <FormProvider {...passwordMethods}>
              <form
                onSubmit={passwordMethods.handleSubmit(onPasswordSubmit)}
                className="space-y-6"
              >
                <CommonInput
                  name="oldPassword"
                  label="Current Password"
                  type="password"
                  placeholder="Enter your current password"
                  required
                />

                <CommonInput
                  name="newPassword"
                  label="New Password"
                  type="password"
                  placeholder="Enter your new password"
                  required
                />

                <CommonInput
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm your new password"
                  required
                />

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {passwordLoading ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}
        </div>
      </div>
    </div>
  );
}
