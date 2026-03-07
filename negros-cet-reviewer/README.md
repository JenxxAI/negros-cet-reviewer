# 🎓 NegrosREV — Free College Entrance Reviewer

A free, community-based college entrance exam reviewer for students in Negros Occidental. Built with Next.js + Supabase + Vercel.

> Independent project · Not affiliated with any school · All questions are original

---

## 🚀 Getting Started

### 1. Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/negros-cet-reviewer
cd negros-cet-reviewer
npm install
```

### 2. Set up Supabase
- Go to supabase.com → New Project
- Open SQL Editor → Run the contents of `supabase-schema.sql`
- Go to Settings → API → Copy your keys

### 3. Add environment variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
```

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Vercel
- Push to GitHub
- Import on vercel.com
- Add the 3 environment variables
- Deploy!

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
