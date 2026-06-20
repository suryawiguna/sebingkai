type Variant = "primary" | "secondary" | "ghost" | "soft";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const sizeClasses: Record<Size, string> = {
  sm: "h-[38px] px-[14px] text-[14px] gap-1.5",
  md: "h-[46px] px-5 text-[16px] gap-2",
  lg: "h-[56px] px-[26px] text-[18px] gap-2.5",
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-white border-transparent hover:bg-accent-hover",
  secondary: "bg-surface text-ink border-border hover:bg-base-sunken",
  ghost: "bg-transparent text-ink border-transparent hover:bg-base-sunken",
  soft: "bg-accent-soft text-on-soft border-transparent hover:bg-[#E7CDBD]",
};

// Button — recording-red is reserved for `primary`.
export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  type = "button",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex select-none items-center justify-center whitespace-nowrap rounded-sm border font-body font-medium leading-none transition-[background-color,border-color,transform,color] duration-150 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45 ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${fullWidth ? "w-full" : "w-auto"} ${className}`}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
