// components/ThemeWrapper.js
"use client"; // Marque como Client Component

import { ThemeProvider } from "./ThemeContext"; // Importe o ThemeProvider
import MainHeader from "../components/layout/MainHeader";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";

export default function ThemeWrapper({ children }) {
  return (
    <ThemeProvider>
      <header>
        <MainHeader />
      </header>
      <Header />
      {children}
      <footer>
        <Footer />
      </footer>
    </ThemeProvider>
  );
}