-- supabase_schema.sql
-- Run this script in your Supabase SQL Editor to initialize all tables.

-- 1. Create Profiles Table (linked to Supabase Auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  name text,
  weight numeric,
  height numeric,
  age integer,
  gender text check (gender in ('male', 'female')),
  activity numeric,
  condition_id text,
  waist numeric,
  updated_at timestamp with time zone default now()
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile."
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can insert own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

-- 2. Create Meals Table
create table public.meals (
  logged_id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  user_email text not null,
  food_id text not null,
  name text not null,
  brand text,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fat numeric not null,
  sodium numeric not null,
  multiplier numeric not null,
  logged_grams numeric not null,
  meal_type text not null check (meal_type in ('Breakfast', 'Lunch', 'Dinner', 'Snack')),
  created_at timestamp with time zone default now()
);

-- Enable RLS for Meals
alter table public.meals enable row level security;

create policy "Users can view own meals."
  on public.meals for select
  using ( auth.uid() = user_id );

create policy "Users can insert own meals."
  on public.meals for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own meals."
  on public.meals for update
  using ( auth.uid() = user_id );

create policy "Users can delete own meals."
  on public.meals for delete
  using ( auth.uid() = user_id );

-- 3. Create Weight History Table
create table public.weight_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  user_email text not null,
  date date not null,
  weight numeric not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS for Weight History
alter table public.weight_history enable row level security;

create policy "Users can view own weight history."
  on public.weight_history for select
  using ( auth.uid() = user_id );

create policy "Users can insert own weight history."
  on public.weight_history for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete own weight history."
  on public.weight_history for delete
  using ( auth.uid() = user_id );

-- 4. Create Fluids Table
create table public.fluids (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  user_email text not null,
  date date not null,
  amount numeric not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS for Fluids
alter table public.fluids enable row level security;

create policy "Users can view own fluids."
  on public.fluids for select
  using ( auth.uid() = user_id );

create policy "Users can insert own fluids."
  on public.fluids for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own fluids."
  on public.fluids for update
  using ( auth.uid() = user_id );

-- 5. Create Checklists Table
create table public.checklists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  user_email text not null,
  date date not null,
  items jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  constraint checklists_user_id_date_key unique (user_id, date)
);

-- Enable RLS for Checklists
alter table public.checklists enable row level security;

create policy "Users can view own checklists."
  on public.checklists for select
  using ( auth.uid() = user_id );

create policy "Users can insert own checklists."
  on public.checklists for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own checklists."
  on public.checklists for update
  using ( auth.uid() = user_id );

-- 6. Create Labs Table
create table public.labs (
  user_id uuid references auth.users on delete cascade primary key,
  user_email text not null unique,
  uric_acid numeric,
  ureum numeric,
  creatinine numeric,
  potassium numeric,
  sodium numeric,
  phosphorus numeric,
  last_updated text,
  updated_at timestamp with time zone default now()
);

-- Enable RLS for Labs
alter table public.labs enable row level security;

create policy "Users can view own labs."
  on public.labs for select
  using ( auth.uid() = user_id );

create policy "Users can insert own labs."
  on public.labs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own labs."
  on public.labs for update
  using ( auth.uid() = user_id );

-- Create Indexes for performance
create index meals_user_id_idx on public.meals(user_id);
create index weight_history_user_id_idx on public.weight_history(user_id);
create index fluids_user_id_idx on public.fluids(user_id);
create index checklists_user_id_idx on public.checklists(user_id);
