interface ButtonProps {
    children?: React.ReactNode;
    variant?: "default" | "fullRounded";
    type?: "button" | "submit";
  }

  export default function Button({
    children,
    variant = "default",
    type = "button",
  }: ButtonProps) {
    const baseStyles =
      "w-full px-4 py-2  shadow-md transition bg-foreground text-background hover:opacity-80";
    const variants = {
      default: "rounded-lg",
      fullRounded: "rounded-full",
    };

    return (
      <button type={type} className={`${baseStyles} ${variants[variant]}`}>
        {children}
      </button>
    );
  }
