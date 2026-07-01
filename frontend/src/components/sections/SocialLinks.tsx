import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/SocialIcons";
import type { Profile } from "@/types/profile";

export function SocialLinks({ profile }: { profile: Profile }) {
  const links = [
    profile.github_url && {
      href: profile.github_url,
      label: "GitHub",
      Icon: GitHubIcon,
    },
    profile.linkedin_url && {
      href: profile.linkedin_url,
      label: "LinkedIn",
      Icon: LinkedInIcon,
    },
    profile.public_email && {
      href: `mailto:${profile.public_email}`,
      label: "Email",
      Icon: MailIcon,
    },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof GitHubIcon }[];

  if (links.length === 0) return null;

  return (
    <div className="flex gap-3">
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-primary/60 hover:text-primary"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
