import "./globals.css";

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
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}