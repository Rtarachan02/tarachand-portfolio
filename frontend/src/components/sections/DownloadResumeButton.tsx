import { DownloadIcon } from "@/components/ui/SocialIcons";
import { resumeDownloadUrl, useResumeAvailable } from "@/hooks/useResume";

export function DownloadResumeButton() {
  const { data: available } = useResumeAvailable();

  if (!available) return null;

  return (
    <a
      href={resumeDownloadUrl}
      download
      className="flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
    >
      <DownloadIcon className="h-4 w-4" />
      Download Resume
    </a>
  );
}
