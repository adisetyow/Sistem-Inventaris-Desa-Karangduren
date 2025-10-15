import clsx from "clsx";
import { Link } from "react-router-dom";

const Button = ({
  as = "button", // 'button' or 'Link'
  to,
  type = "button",
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    warning:
      "bg-yellow-400 text-gray-800 hover:bg-yellow-500 focus:ring-yellow-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (as === "Link") {
    return (
      <Link
        to={to}
        className={classes}
        {...props}
        aria-disabled={disabled ? "true" : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
      aria-disabled={disabled ? "true" : undefined}
    >
      {children}
    </button>
  );
};

export default Button;
