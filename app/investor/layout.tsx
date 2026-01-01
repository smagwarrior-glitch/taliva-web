import Link from "next/link";

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-xl font-extrabold tracking-wide">
          TALIVA
        </Link>

        <nav className="flex items-center gap-4 text-sm text-white/80">
          <Link className="hover:text-white" href="/">
            Home
          </Link>
          <Link className="hover:text-white" href="/investor/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-white" href="/investor/athletes">
            Athletes
          </Link>
        </nav>
      </header>

      {children}
    </main>
  );
}