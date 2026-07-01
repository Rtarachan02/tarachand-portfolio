/**
 * Renders raw embed HTML from LinkedIn's own "Embed this post" share option.
 * Safe to render as-is: this value is only ever set by the authenticated site
 * admin via /admin (see ProfileUpdate.linkedin_embed_html), never by public input.
 */
export function LinkedInEmbed({ html }: { html: string | null }) {
  if (!html) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold tracking-tight">Latest on LinkedIn</h2>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
