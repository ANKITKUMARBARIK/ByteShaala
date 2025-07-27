import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";

import { useResetPasswordMutation } from "@/actions/authActions";
import CommonInput from "@/components/common/common-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Validation schema for reset password
const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  // ),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export function ResetPasswordForm({ className, ...props }) {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const params = useParams();

  // Check if token exists in URL params
  const resetToken = params.token;

  const methods = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    resolver: yupResolver(resetPasswordSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    if (!resetToken) {
      toast.error("Invalid reset link. Please request a new password reset.");
      return;
    }

    try {
      const result = await resetPassword({
        token: resetToken,
        ...data,
      }).unwrap();

      if (result?.success) {
        toast.success("Password changed successfully!");
        navigate("/login");
      } else {
        toast.error(result?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  // Show error if no token in URL
  if (!resetToken) {
    return (
      <div className={cn("grid gap-6", className)} {...props}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-center text-red-600">
              Invalid Reset Link
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              This password reset link is invalid or has expired.
            </p>
          </div>
        </div>
        <Button onClick={() => navigate("/forgot-password")} className="w-full">
          Request New Reset Link
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <h1 className="text-2xl font-semibold tracking-tight text-center">
                Reset Password
              </h1>
              <p className="text-sm text-muted-foreground text-center">
                Enter your new password below
              </p>
            </div>
          </div>

          <div className="grid gap-8">
            <div className="grid gap-2">
              <CommonInput
                name="newPassword"
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="grid gap-2">
              <CommonInput
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your new password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </div>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="underline underline-offset-4 hover:text-primary"
              >
                Back to Login
              </button>
            </p>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
