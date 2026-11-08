# sauravsharma.info

Personal portfolio of Saurav Sharma — Next.js 16 (App Router) static export + Tailwind v4, Geist type, hand-built animated SVG diagrams (no animation library). Design language modelled on vidyst.com.

## Develop

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

## Content

Everything written on the site lives in `lib/content.ts` (keep in sync with the résumé). The résumé PDF is `public/Saurav_Sharma_Resume.pdf`.

## Deploy

```bash
./deploy.sh         # lint → build → rsync out/ to vm_oracle:/var/www/sauravsharma.info → health check
```

Hosting: Oracle Cloud ARM VM, nginx vhost `/etc/nginx/sites-available/sauravsharma.info` (HTTPS via certbot, www/http → https://sauravsharma.info, immutable caching for `/_next/static`, CSP + security headers).

## Motion

- `lib/motion.ts` — global pause store (localStorage), reduced-motion, in-view gating, rAF/interval hooks.
- CSS keyframes in `app/globals.css` pause via `html[data-motion=paused]` and `[data-offscreen]`.
- `prefers-reduced-motion` disables loops, reveals and hides the pause control.
