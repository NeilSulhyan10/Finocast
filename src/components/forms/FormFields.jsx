"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(
  ({ label, type = "text", error, hint, required = false, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-graphite mb-1.5">
            {label}
            {required && <span className="text-molten-copper ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`${error ? errorId : ""} ${hint ? hintId : ""}`.trim() || undefined}
          className={cn(
            "w-full px-4 py-3 bg-white border rounded-lg font-body text-foundry-black placeholder-steel-grey",
            "transition-colors duration-200",
            "hover:border-steel-grey/50",
            "focus:outline-none focus:ring-2 focus:ring-molten-copper focus:border-transparent",
            "disabled:bg-graphite/10 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500",
            !error && "border-graphite/20",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-steel-grey">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef(
  ({ label, error, hint, required = false, rows = 4, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-graphite mb-1.5">
            {label}
            {required && <span className="text-molten-copper ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          required={required}
          rows={rows}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`${error ? errorId : ""} ${hint ? hintId : ""}`.trim() || undefined}
          className={cn(
            "w-full px-4 py-3 bg-white border rounded-lg font-body text-foundry-black placeholder-steel-grey resize-y min-h-[100px]",
            "transition-colors duration-200",
            "hover:border-steel-grey/50",
            "focus:outline-none focus:ring-2 focus:ring-molten-copper focus:border-transparent",
            "disabled:bg-graphite/10 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500",
            !error && "border-graphite/20",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-steel-grey">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export const Select = forwardRef(
  ({ label, options, placeholder, error, hint, required = false, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const hintId = `${selectId}-hint`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-graphite mb-1.5">
            {label}
            {required && <span className="text-molten-copper ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`${error ? errorId : ""} ${hint ? hintId : ""}`.trim() || undefined}
          className={cn(
            "w-full px-4 py-3 bg-white border rounded-lg font-body text-foundry-black",
            "transition-colors duration-200",
            "hover:border-steel-grey/50",
            "focus:outline-none focus:ring-2 focus:ring-molten-copper focus:border-transparent",
            "disabled:bg-graphite/10 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500",
            !error && "border-graphite/20",
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-steel-grey">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export const Checkbox = forwardRef(
  ({ label, description, error, required = false, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = `${checkboxId}-error`;

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            required={required}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "mt-0.5 h-5 w-5 rounded border-graphite/30 text-molten-copper",
              "focus:outline-none focus:ring-2 focus:ring-molten-copper focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors duration-200",
              className
            )}
            {...props}
          />
          <div className="flex-1">
            {label && (
              <label htmlFor={checkboxId} className="text-sm font-medium text-foundry-black cursor-pointer">
                {label}
                {required && <span className="text-molten-copper ml-1" aria-hidden="true">*</span>}
              </label>
            )}
            {description && <p className="mt-0.5 text-sm text-steel-grey">{description}</p>}
          </div>
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600 ml-8" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export const FormField = ({ children, className = "", ...props }) => {
  return <div className={cn("w-full", className)} {...props}>{children}</div>;
};

export const FieldGroup = ({ children, className = "", columns = 1, ...props }) => {
  const gridClass = columns > 1 ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "";
  return (
    <div className={cn(gridClass, className)} {...props}>
      {children}
    </div>
  );
};