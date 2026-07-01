import { GitHubIcon } from "@/components/ui/SocialIcons";
import { useGitHubStats } from "@/hooks/useGitHubStats";

export function GitHubStatsCard({ enabled }: { enabled: boolean }) {
  const { data, isLoading, isError } = useGitHubStats(enabled);

  if (!enabled || isLoading || isError || !data) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-6">
      <div className="flex items-center gap-3">
        <GitHubIcon className="h-5 w-5" />
        <a
          href={data.profile_url}
          target="_blank"
          rel="noreferrer noopener"
          className="font-mono text-sm text-muted hover:text-primary"
        >
          @{data.username}
        </a>
      </div>
      <div className="mt-4 flex gap-6 text-sm">
        <div>
          <p className="text-xl font-bold">{data.public_repos}</p>
          <p className="text-xs text-muted">Public repos</p>
        </div>
        <div>
          <p className="text-xl font-bold">{data.followers}</p>
          <p className="text-xs text-muted">Followers</p>
        </div>
      </div>
      {data.recent_repos.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
          {data.recent_repos.slice(0, 3).map((repo) => (
            <li key={repo.name} className="flex items-center justify-between text-sm">
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer noopener"
                className="truncate text-foreground hover:text-primary"
              >
                {repo.name}
              </a>
              <span className="ml-2 shrink-0 text-xs text-muted">★ {repo.stars}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
