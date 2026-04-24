"use client";

import { useTheme } from "./ThemeContext";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? "bg-black text-white" : "bg-[#FFFCF6] text-black"}>
      {children}
    </div>
  );
}


