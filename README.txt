NORTON HELP — CORRECTED GITHUB PAGES PACKAGE

Files:
- index.html    = Norton Help tech-support homepage
- style.css     = homepage design
- app.js        = homepage interactions
- cancel.html   = subscription cancellation form
- cancel.css    = cancellation form design
- cancel.js     = cancellation form + Supabase submission
- admin.html    = admin login/dashboard
- admin.css     = admin design
- admin.js      = admin dashboard logic
- config.js     = Supabase URL + anon/publishable key
- supabase.sql  = database/RLS setup

GITHUB PAGES:
Repository: norton360antivirus/help
Expected site: https://norton360antivirus.github.io/help/

IMPORTANT:
1. Upload ALL files from this folder to the repository root.
2. Keep index.html as the homepage.
3. The cancellation form is now cancel.html.
4. Enable GitHub Pages: Settings > Pages > Deploy from a branch > main > /(root).
5. Put your Supabase project URL and anon/publishable key in config.js.
6. Run supabase.sql in Supabase SQL Editor and create the admin Auth user.
7. Never collect passwords, full card numbers, CVV, PIN or OTP.

BRAND/DISCLAIMER:
Norton Help is an independent support service and is not affiliated with,
sponsored by, or endorsed by Norton. Norton and related marks belong to
their respective owners.
