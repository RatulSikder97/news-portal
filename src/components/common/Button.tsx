import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
  secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-300",
  success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
};

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
