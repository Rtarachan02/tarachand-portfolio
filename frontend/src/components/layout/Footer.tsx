export function Footer() {
  return (
    <footer className="border-t border-border/60 py-8 text-center text-sm text-muted">
      <p>© {new Date().getFullYear()} Tarachand Rana. Built with FastAPI, React 19 & Three.js.</p>
    </footer>
  );
}
