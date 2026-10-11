import { cn } from "@/lib/utils";

export function SectionHeading({
  number,
  eyebrow,
  title,
  subtitle,
  className = "",
  align = "left",
  size = "default",
  ...props
}) {
  const sizes = {
    sm: { eyebrow: "text-xs", number: "text-4xl", title: "text-3xl sm:text-4xl", subtitle: "text-base" },
    default: { eyebrow: "text-sm", number: "text-6xl", title: "text-4xl sm:text-5xl lg:text-6xl", subtitle: "text-lg" },
    lg: { eyebrow: "text-base", number: "text-7xl", title: "text-5xl sm:text-6xl lg:text-7xl", subtitle: "text-xl" },
  };

  const s = sizes[size];
  const alignClasses = { left: "text-left", center: "text-center", right: "text-right" };

  return (
    <div className={cn(`max-w-3xl ${alignClasses[align]}`, className)} {...props}>
      {eyebrow && (
        <p className={`${s.eyebrow} font-medium text-molten-copper tracking-widest uppercase mb-3`}>
          {eyebrow}
        </p>
      )}
      {number && (
        <span
          className={`${s.number} font-heading font-bold text-molten-copper/20 leading-none tracking-tight block mb-4 select-none`}
          aria-hidden="true"
        >
          {String(number).padStart(2, "0")}
        </span>
      )}
      {title && (
        <h2 className={`${s.title} font-heading font-semibold text-foundry-black leading-tight tracking-tight mb-4`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`${s.subtitle} text-graphite leading-relaxed`}>{subtitle}</p>
      )}
    </div>
  );
}

export function Heading({
  children,
  level = 2,
  className = "",
  size,
  weight = "semibold",
  color = "foundry-black",
  ...props
}) {
  const sizes = {
    h1: "text-4xl sm:text-5xl lg:text-6xl",
    h2: "text-3xl sm:text-4xl lg:text-5xl",
    h3: "text-2xl sm:text-3xl",
    h4: "text-xl sm:text-2xl",
    h5: "text-lg sm:text-xl",
    h6: "text-base sm:text-lg",
    display: "text-5xl sm:text-6xl lg:text-7xl",
    ...(size ? { custom: size } : {}),
  };

  const Tag = `h${level}`;

  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colors = {
    "foundry-black": "text-foundry-black",
    "warm-white": "text-warm-white",
    "molten-copper": "text-molten-copper",
    "graphite": "text-graphite",
    "steel-grey": "text-steel-grey",
    inherit: "text-inherit",
  };

  return (
    <Tag
      className={cn(
        "font-heading leading-tight tracking-tight",
        sizes[level] || sizes.h2,
        weights[weight],
        colors[color],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Text({
  children,
  className = "",
  size = "base",
  color = "graphite",
  weight = "normal",
  lead = false,
  mono = false,
  ...props
}) {
  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const colors = {
    "foundry-black": "text-foundry-black",
    graphite: "text-graphite",
    "steel-grey": "text-steel-grey",
    "warm-white": "text-warm-white",
    "molten-copper": "text-molten-copper",
    muted: "text-steel-grey",
    inherit: "text-inherit",
  };

  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  return (
    <p
      className={cn(
        "leading-relaxed",
        sizes[size],
        colors[color],
        weights[weight],
        lead && "text-lg leading-relaxed",
        mono && "font-mono",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Label({
  children,
  className = "",
  size = "sm",
  required = false,
  ...props
}) {
  return (
    <label className={`block font-medium text-graphite mb-1.5 ${size === "sm" ? "text-sm" : "text-base"} ${className}`} {...props}>
      {children}
      {required && <span className="text-molten-copper ml-1" aria-hidden="true">*</span>}
    </label>
  );
}

export function Eyebrow({ children, className = "", color = "molten-copper", ...props }) {
  const colors = {
    "molten-copper": "text-molten-copper",
    "warm-white": "text-warm-white",
    "steel-grey": "text-steel-grey",
    "foundry-black": "text-foundry-black",
  };

  return (
    <span
      className={`inline-block text-xs font-medium tracking-widest uppercase ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function Badge({ children, className = "", variant = "default", ...props }) {
  const variants = {
    default: "bg-graphite text-warm-white",
    primary: "bg-molten-copper text-white",
    outline: "border-2 border-graphite text-graphite bg-transparent",
    success: "bg-green-900 text-green-100",
    warning: "bg-amber-900 text-amber-100",
    error: "bg-red-900 text-red-100",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function TechLabel({ label, value, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-0.5 font-mono text-xs ${className}`} {...props}>
      <span className="text-steel-grey uppercase tracking-wider">{label}</span>
      <span className="text-foundry-black font-medium">{value}</span>
    </div>
  );
}