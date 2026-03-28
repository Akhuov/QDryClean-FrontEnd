"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = (props) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-right" // 👈 где показывать
      richColors // 👈 нормальные цвета success/error
      closeButton // 👈 крестик
      expand // 👈 красиво раскрывается длинный текст
      duration={3000} // 👈 дефолт время
      visibleToasts={3} // 👈 максимум на экране
      offset={16} // 👈 отступ от края

      className="toaster group"

      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",

        // 👇 кастом цвета (очень круто выглядит)
        "--success-bg": "#ecfdf5",
        "--success-text": "#065f46",
        "--error-bg": "#fef2f2",
        "--error-text": "#7f1d1d",
      }}

      {...props}
    />
  );
};

export { Toaster };