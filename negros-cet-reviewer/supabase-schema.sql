-- ============================================
-- NegrosREV Database Schema (SAFE UPDATE)
-- Safe to re-run on an existing database.
-- ============================================

-- Schools table
create table if not exists schools (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  full_name text,
  slug text unique not null,
  exam_name text,
  color text default '#c9a84c',
  created_at timestamptz default now()
);

-- Subjects table
create table if not exists subjects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null,
  icon text,
  school_id uuid references schools(id) on delete cascade,
  created_at timestamptz default now(),
  unique (slug, school_id)
);

-- Questions table
create table if not exists questions (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references subjects(id) on delete cascade,
  school_id uuid references schools(id) on delete set null,
  question_text text not null,
  choice_a text not null,
  choice_b text not null,
  choice_c text not null,
  choice_d text not null,
  correct_answer char(1) not null check (correct_answer in ('a','b','c','d')),
  explanation text,
  difficulty text default 'medium' check (difficulty in ('easy','medium','hard')),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Sessions (exam attempts)
create table if not exists sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  school_slug text,
  subject_slug text,
  difficulty text,
  score int default 0 check (score >= 0),
  total_items int default 0 check (total_items >= 0),
  time_taken int default 0 check (time_taken >= 0),
  finished_at timestamptz default now()
);

-- Results (per question answer)
create table if not exists results (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references sessions(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  chosen_answer char(1) check (chosen_answer in ('a','b','c','d') or chosen_answer is null),
  is_correct boolean default false
);

-- ============================================
-- Row Level Security
-- ============================================

alter table schools enable row level security;
alter table subjects enable row level security;
alter table questions enable row level security;
alter table sessions enable row level security;
alter table results enable row level security;

-- ============================================
-- Policies (safe create, fix broken RLS)
-- ============================================

do $$
begin

  -- Read policies
  if not exists (
    select 1 from pg_policies where policyname = 'Public read schools' and tablename = 'schools'
  ) then
    create policy "Public read schools" on schools for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where policyname = 'Public read subjects' and tablename = 'subjects'
  ) then
    create policy "Public read subjects" on subjects for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where policyname = 'Public read questions' and tablename = 'questions'
  ) then
    create policy "Public read questions" on questions for select using (is_active = true);
  end if;

  -- Insert policies
  if not exists (
    select 1 from pg_policies where policyname = 'Anyone insert sessions' and tablename = 'sessions'
  ) then
    create policy "Anyone insert sessions" on sessions for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where policyname = 'Anyone insert results' and tablename = 'results'
  ) then
    create policy "Anyone insert results" on results for insert with check (true);
  end if;

  -- Fix broken RLS: drop old policy (had 'or user_id is null' security leak) and recreate
  drop policy if exists "Users read own sessions" on sessions;
  create policy "Users read own sessions" on sessions
    for select using (auth.uid() = user_id);

end $$;

-- ============================================
-- Indexes (safe create)
-- ============================================

create index if not exists idx_questions_school_id on questions(school_id);
create index if not exists idx_questions_subject_difficulty on questions(subject_id, difficulty, is_active);
create index if not exists idx_subjects_school_id on subjects(school_id);
create index if not exists idx_results_session_id on results(session_id);
create index if not exists idx_sessions_user_id on sessions(user_id);

-- ============================================
-- Sample Data (insert, skip duplicates)
-- ============================================

insert into schools (name, full_name, slug, exam_name, color) values
('SUNN', 'State University of Northern Negros', 'sunn', 'General Aptitude Test', '#3fb950'),
('TUP', 'Technological University of the Philippines', 'tup', 'TUPSTAT', '#58a6ff'),
('CHMSU', 'Carlos Hilado Memorial State University', 'chmsu', 'CHMSUET', '#c9a84c'),
('PNU', 'Philippine Normal University', 'pnu', 'PNUAT', '#bc8cff'),
('La Salle', 'La Salle College', 'lasalle', 'Entrance Exam', '#f85149'),
('CSA', 'Colegio San Agustin', 'csa', 'Entrance Exam', '#ff9500'),
('General', 'General Practice Mode', 'general', 'Mixed Practice', '#c9a84c')
on conflict (slug) do nothing;
