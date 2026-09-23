import "./globals.css";
import { Suspense } from "react";
import Header from "./components/Header";

export const metadata = {
  title: "TALIVA",
  description: "Where Talent Gets a Real Chance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Suspense fallback={<div className="site-header" aria-hidden="true"><div className="site-header-inner">TALIVA</div></div>}>
          <Header />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
