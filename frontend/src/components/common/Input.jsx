import clsx from "clsx";

const Input = ({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  error = "",
  className = "",
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={clsx(
          "block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm",
          disabled && "bg-gray-100 cursor-not-allowed",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id || name}-error` : undefined}
      />
      {error && (
        <p id={`${id || name}-error`} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
