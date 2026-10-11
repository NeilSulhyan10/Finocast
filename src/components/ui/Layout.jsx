export function Container({ children, className = "", size = "default", ...props }) {
  const sizes = {
    default: "max-w-[1280px]",
    sm: "max-w-[640px]",
    md: "max-w-[768px]",
    lg: "max-w-[1024px]",
    xl: "max-w-[1280px]",
    "2xl": "max-w-[1536px]",
    full: "max-w-full",
  };

  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Grid({ children, className = "", columns = 1, gap = 6, responsive = true, ...props }) {
  const gridClasses = responsive
    ? `grid grid-cols-${columns} sm:grid-cols-2 lg:grid-cols-${columns} gap-${gap}`
    : `grid grid-cols-${columns} gap-${gap}`;

  return (
    <div className={`${gridClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Flex({ children, className = "", direction = "row", align = "stretch", justify = "stretch", gap = 4, wrap = false, ...props }) {
  return (
    <div
      className={`flex flex-${direction} items-${align} justify-${justify} gap-${gap} ${wrap ? "flex-wrap" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Section({ children, className = "", padding = "default", background, ...props }) {
  const paddings = {
    none: "",
    sm: "py-12 sm:py-16",
    default: "py-16 sm:py-24 lg:py-32",
    lg: "py-24 sm:py-32 lg:py-40",
  };

  const backgrounds = {
    light: "bg-warm-white",
    dark: "bg-foundry-black text-warm-white",
    graphite: "bg-graphite text-warm-white",
    none: "",
  };

  return (
    <section
      className={`${paddings[padding]} ${backgrounds[background] || ""} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}