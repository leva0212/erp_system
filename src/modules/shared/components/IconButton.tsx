"use client";

type Props = {
  icon: React.ReactNode;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "danger" | "success" | "ghost";
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function IconButton({
  icon,
  label,
  size = "md",
  variant = "default",
  title = "",
  onClick,
  disabled = false,
}: Props) {
  const sizes = {
    sm: label ? "h-6 text-xs px-2" : "w-6 h-6 text-xs",
    md: label ? "h-8 text-sm px-2" : "w-8 h-8 text-sm",
    lg: label ? "h-10 text-base px-3" : "w-10 h-10 text-base",
  };

  const variants = {
    default:
      "bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800",

    danger:
      "bg-red-100 hover:bg-red-200 text-red-700 border border-red-300",

    success:
      "bg-green-100 hover:bg-green-200 text-green-700 border border-green-300",

    ghost:
      "bg-transparent hover:bg-gray-100 border border-transparent text-gray-800",
  };

  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizes[size]}
        ${variants[variant]}
        flex items-center justify-center gap-1
        !rounded-none
        transition
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {icon}
      {label && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}