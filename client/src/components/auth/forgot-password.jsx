import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";

import { useForgotPasswordMutation } from "@/actions/authActions";
import CommonInput from "@/components/common/common-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Validation schema for forgot password
const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .trim(),
});

export function ForgotPasswordForm({ className, ...props }) {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const onSubmit = async (data) => {
    try {
      const result = await forgotPassword(data).unwrap();

      if (result?.success) {
        toast.success(
          "Please check your email for password reset instructions"
        );
        setValue("email", "");
      } else {
        toast.error(result?.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error?.data?.message || "Failed to send reset email");
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <h1 className="text-2xl font-semibold tracking-tight text-center">
                Forgot Password
              </h1>
              <p className="text-sm text-muted-foreground text-center">
                Enter your email address and we&apos;ll send you a reset link
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <CommonInput
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email address"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? "Sending..." : "Send Reset Link"}
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
