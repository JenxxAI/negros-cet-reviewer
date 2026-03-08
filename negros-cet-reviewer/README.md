# 🎓 NegrosREV — Free College Entrance Reviewer

A free, community-based college entrance exam reviewer for students in Negros Occidental. Built with Next.js + Supabase + Vercel.

> Independent project · Not affiliated with any school · All questions are original

---

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Give it a name (e.g. `negros-cet`) and set a database password → **Create Project**
3. Once ready, go to **SQL Editor** (left sidebar)
4. Click **New Query**, paste the full contents of `supabase-schema.sql`, and click **Run**
5. Go to **Project Settings → API**
6. Copy these two values — you'll need them in Step 3:
   - **Project URL** (e.g. `https://xxxx.supabase.co`)
   - **anon / public** key
   - **service_role** key (click the eye icon to reveal — keep this secret)

---

### Step 2 — Push the code to GitHub

If not already done:

```bash
git add -A
git commit -m "initial commit"
git push
```

Make sure your repo is public or at least accessible to Vercel.

---

### Step 3 — Import the project on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Click **Import** next to your `negros-cet-reviewer` GitHub repo
3. Vercel will auto-detect **Next.js** — no framework config needed
4. Set the **Root Directory** to `negros-cet-reviewer` (since the app lives in a subfolder)
5. **Before clicking Deploy**, expand **Environment Variables** and add all 5 below:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` (your final Vercel URL) |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key |
| `ADMIN_PASSWORD` | A strong secret password for the `/admin` page |

6. Click **Deploy** — Vercel runs `npm run build` and publishes automatically

---

### Step 4 — Seed questions via /admin

1. Visit `https://your-app.vercel.app/admin`
2. Enter the `ADMIN_PASSWORD` you set above
3. Use the form to add exam questions for each school and subject

---

### Step 5 — Update NEXT_PUBLIC_SITE_URL

After your first deploy, Vercel gives you a permanent URL (e.g. `negros-cet-reviewer.vercel.app`).

1. Go to Vercel → **Project Settings → Environment Variables**
2. Update `NEXT_PUBLIC_SITE_URL` to your real URL
3. Go to **Deployments → Redeploy** (so the OG image uses the correct URL)

---

### Step 6 — Enable auto-deployments (already set up)

Every `git push` to `main` will automatically:
- Run the CI checks (build + tests) via GitHub Actions
- Trigger a new Vercel deployment

---

## 💻 Running Locally

```bash
git clone https://github.com/JenxxAI/negros-cet-reviewer
cd negros-cet-reviewer/negros-cet-reviewer
npm install
```

Create `.env.local` in the `negros-cet-reviewer/` folder:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=any_local_password
```

```bash
npm run dev      # http://localhost:3000
npm test         # run unit tests
npm run build    # production build check
```

---

## 📁 Project Structure

```
app/
  page.js              → Landing page
  exam/
    page.js            → School + subject selector
    start/page.js      → Exam room with timer
  globals.css          → Global styles
lib/
  supabase.js          → Supabase client
supabase-schema.sql    → Database setup
```

---

## 🏫 Supported Schools (Phase 1)
- SUNN — General Aptitude Test
- TUP — TUPSTAT
- CHMSU — CHMSUET
- PNU — PNUAT
- La Salle — Entrance Exam
- CSA — Entrance Exam

## 📚 Subjects Covered
- Mathematics
- English / Reading Comprehension
- Science
- Logic & Abstract Reasoning
- Filipino / Komunikasyon
- General Knowledge
- Technical Reasoning (TUP only)

---

## 🛠️ Tech Stack
- **Next.js 14** — Framework
- **Supabase** — Database + Auth
- **Tailwind CSS** — Styling
- **Vercel** — Hosting
