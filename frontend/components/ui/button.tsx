"use client";
import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost";
};

export const Button: React.FC<ButtonProps> = ({ className = "", variant = "default", ...props }) => {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const styles =
    variant === "ghost"
      ? "bg-transparent hover:bg-white/10 border border-white/20"
      : "bg-white text-black hover:bg-white/90";
  return <button className={`${base} ${styles} px-4 py-2 ${className}`} {...props} />;
};

export default Button;
