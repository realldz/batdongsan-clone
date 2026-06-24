import type { ReactNode, ButtonHTMLAttributes } from "react";

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  children: ReactNode;
}

export function ActionButton({
  variant = "primary",
  icon,
  children,
  className = "",
  type = "button",
  ...props
}: ActionButtonProps) {
  const variants = {
    primary: "bg-[#e03c31] text-white hover:bg-[#c93027]",
    secondary: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
  } as const;

  return (
    <button
      type={type}
      className={`flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition-colors focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
