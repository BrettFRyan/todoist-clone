import React from "react";

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  ...rest
}) => {
  return (
    <button
      className="w-full rounded bg-red-600 py-2 px-4 text-sm text-white hover:bg-red-700 focus:bg-red-700"
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "primary";
}
