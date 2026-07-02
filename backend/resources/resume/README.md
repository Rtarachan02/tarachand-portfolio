# Resume

Drop your resume PDF in this folder as `resume.pdf`. It's committed to git, so — unlike a
runtime file upload — it persists across every deploy: Render rebuilds the Docker image from
the git source on each deploy, and this file is baked into that image at build time rather
than written to the container's (ephemeral) disk while running.

Served at `GET /api/v1/resume/download`. The homepage's "Download Resume" button only appears
once this file exists — `GET /api/v1/resume/info` reports availability, so nothing looks
broken while this file is missing.

To update your resume: replace `resume.pdf`, commit, push. No code changes needed.
