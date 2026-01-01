export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: 24 }}>
      {children}
    </div>
  );
}