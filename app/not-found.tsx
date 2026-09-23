import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container">
      <div className="card mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-extrabold">404</h1>
        <p className="my-4 text-white/70">The requested athlete or page could not be found.</p>
        <Link className="btn btn-primary" href="/investor/athletes?lang=en">Browse athletes</Link>
      </div>
    </main>
  );
}
