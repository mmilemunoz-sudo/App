import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-ink text-white shadow-soft active:scale-[0.99]",
    secondary: "bg-white text-ink border border-black/10 active:scale-[0.99]",
    ghost: "bg-transparent text-ink active:scale-[0.99]"
  };

  return (
    <button
      className={`min-h-14 rounded-lg px-5 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
