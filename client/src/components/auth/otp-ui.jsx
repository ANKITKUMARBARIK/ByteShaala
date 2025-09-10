import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";

import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/actions/authActions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// OTP validation schema
const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d{6}$/, "OTP must contain only numbers"),
});

export function OtpUI({ className, ...props }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state (passed from signup)
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  const inputRefs = useRef([]);

  const methods = useForm({
    defaultValues: {
      otp: "",
    },
    resolver: yupResolver(otpSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  // Timer for resend functionality
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Handle OTP input change
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Update form value
    setValue("otp", newOtp.join(""));

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData
      .split("")
      .concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp.slice(0, 6));
    setValue("otp", newOtp.slice(0, 6).join(""));

    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const result = await verifyOtp({ otpSignup: data.otp }).unwrap();
      console.log("OTP verification data:", result);
      toast.success("Email verified successfully!");
      navigate("/login", {
        state: {
          message: "Email verified successfully! Please log in to continue.",
        },
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please go back to signup.");
      return;
    }

    try {
      setResendLoading(true);

      await resendOtp({ email }).unwrap();

      toast.success("OTP sent successfully!");

      // Reset timer
      setTimer(60);
      setCanResend(false);
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(
        error?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  // Redirect to signup if no email is provided
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  return (
    <FormProvider {...methods}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold">Verify Your Email</h2>
          <p className="text-muted-foreground text-sm text-balance">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="text-sm font-medium text-primary">{email}</p>
        </div>

        <div className="grid gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">
              Enter verification code
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={cn(
                    "w-12 h-12 text-center text-lg font-semibold border rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    "transition-colors duration-200",
                    errors.otp
                      ? "border-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-sm text-red-500 text-center">
                {errors.otp.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Didn&apos;t receive the code?{" "}
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="hover:underline font-medium !bg-transparent !border-none !text-[#0044ff] !px-1"
                >
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>
              ) : (
                <span className="text-muted-foreground">
                  Resend in {timer}s
                </span>
              )}
            </p>
          </div>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              Back to Sign Up
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
