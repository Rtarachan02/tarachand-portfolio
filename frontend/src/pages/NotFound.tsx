import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <Link to="/" className="text-primary underline underline-offset-4">
        Back to home
      </Link>
    </section>
  );
}
