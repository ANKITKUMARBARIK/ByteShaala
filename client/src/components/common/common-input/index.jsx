import { useId, useRef } from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function CommonInput({
  name,
  label,
  hideLabel = false,
  type = "text",
  placeholder,
  className,
  required = false,
  ...rest
}) {
  const isBlurred = useRef(false);
  const { register, trigger, formState, setValue } = useFormContext();
  const fieldState = register(name);

  const id = useId();
  const error = formState.errors[name];
  const hasError = !!error;

  return (
    <div className="relative">
      <div className="grid gap-2">
        {!hideLabel && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...fieldState}
          {...rest}
          onBlur={(e) => {
            fieldState.onBlur(e);
            trigger(name);
            isBlurred.current = true;
          }}
          onChange={(e) => {
            fieldState.onChange(e);
            setValue(name, e.target.value, {
              shouldValidate: isBlurred.current,
            });
          }}
        />
      </div>

      {/* Absolutely positioned error message - doesn't affect layout flow */}
      {hasError && (
        <p
          className="absolute top-full left-0 mt-1 text-xs text-red-500 leading-tight z-10"
          id={`${id}-error`}
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

// Export as default for easier imports
export default CommonInput;
