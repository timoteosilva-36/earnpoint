-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  balance numeric default 0,
  pix_key text,
  created_at timestamp default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Create quizzes table
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text,
  questions jsonb not null,
  reward_points integer default 10,
  created_at timestamp default now()
);

alter table public.quizzes enable row level security;

create policy "quizzes_select_all"
  on public.quizzes for select
  using (true);

-- Create user answers table
create table if not exists public.user_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  answers jsonb not null,
  score integer,
  points_earned integer default 0,
  completed_at timestamp default now()
);

alter table public.user_answers enable row level security;

create policy "user_answers_select_own"
  on public.user_answers for select
  using (auth.uid() = user_id);

create policy "user_answers_insert_own"
  on public.user_answers for insert
  with check (auth.uid() = user_id);

-- Create withdrawal requests table
create table if not exists public.withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,
  pix_key text not null,
  status text default 'pending',
  created_at timestamp default now()
);

alter table public.withdrawal_requests enable row level security;

create policy "withdrawal_requests_select_own"
  on public.withdrawal_requests for select
  using (auth.uid() = user_id);

create policy "withdrawal_requests_insert_own"
  on public.withdrawal_requests for insert
  with check (auth.uid() = user_id);
