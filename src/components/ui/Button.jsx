"use client";

import { forwardRef } from "react";

export const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      href,
      className = "",
      disabled = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-molten-copper focus-visible:ring-offset-2 focus-visible:ring-offset-warm-white disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-molten-copper text-white hover:bg-[var(--color-primary-hover)] active:scale-[0.98] shadow-sm",
      secondary:
        "bg-foundry-black text-warm-white hover:bg-graphite active:scale-[0.98]",
      outline:
        "border-2 border-foundry-black text-foundry-black hover:bg-foundry-black hover:text-warm-white active:scale-[0.98]",
      outlineLight:
        "border-2 border-warm-white text-warm-white hover:bg-warm-white hover:text-foundry-black active:scale-[0.98]",
      ghost:
        "text-foundry-black hover:bg-[var(--color-border)] active:scale-[0.98]",
      link: "text-molten-copper underline-offset-2 hover:underline",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm gap-2",
      md: "px-6 py-3 text-base gap-2",
      lg: "px-8 py-4 text-lg gap-3",
      xl: "px-10 py-5 text-xl gap-3",
    };

    const Component = href ? "a" : "button";

    const childProps = {
      ref,
      className: `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`,
      type: Component === "button" ? type : undefined,
      disabled: Component === "button" ? disabled : undefined,
      href: Component === "a" ? href : undefined,
      ...props,
    };

    return <Component {...childProps}>{children}</Component>;
  }
);

Button.displayName = "Button";

export const ButtonGroup = ({ children, className = "", ...props }) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
};