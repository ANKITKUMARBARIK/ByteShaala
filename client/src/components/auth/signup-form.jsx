import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";

import CommonInput from "@/components/common/common-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signupSchema } from "@/validations";

export function SignupForm({ className, ...props }) {
  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      gender: "",
    },
    resolver: yupResolver(signupSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log("Signup data:", data);
      // TODO: Implement actual signup logic here
      // Example: await registerUser(data);
    } catch (error) {
      console.error("Signup error:", error);
      // TODO: Handle signup errors
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h2>Create account</h2>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your details below to create your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <CommonInput
              name="firstName"
              label="First Name"
              type="text"
              placeholder="John"
              required
            />
            <CommonInput
              name="lastName"
              label="Last Name"
              type="text"
              placeholder="Doe"
              required
            />
          </div>

          <CommonInput
            name="email"
            label="Email"
            type="email"
            placeholder="m@example.com"
            required
          />

          <CommonInput
            name="password"
            label="Password"
            type="password"
            placeholder="Create a strong password"
            required
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>

          <Button variant="outline" className="w-full" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Sign up with GitHub
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
