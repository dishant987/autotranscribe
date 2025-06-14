import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "../theme-provider";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      toastOptions={{ duration: 5000, className: "toaster-item" }}
      {...props}
    />
  );
};

export { Toaster };
