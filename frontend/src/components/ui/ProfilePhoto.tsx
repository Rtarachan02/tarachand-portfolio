export function ProfilePhoto({ photoUrl }: { photoUrl: string | null }) {
  return (
    <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-primary/40 bg-surface shadow-lg shadow-primary/10 sm:h-44 sm:w-44 lg:h-56 lg:w-56">
      {photoUrl ? (
        <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
      ) : (
        <svg viewBox="0 0 100 100" className="h-full w-full text-muted/40" fill="currentColor">
          <circle cx="50" cy="38" r="18" />
          <path d="M50 60c-22 0-34 12-34 26v6h68v-6c0-14-12-26-34-26z" />
        </svg>
      )}
    </div>
  );
}
