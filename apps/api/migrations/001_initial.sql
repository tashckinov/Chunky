create extension if not exists pgcrypto;

create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table decks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  level text not null check (level in ('A2', 'B1', 'B2', 'C1')),
  created_at timestamptz not null default now()
);

create table chunks (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references decks(id) on delete cascade,
  phrase text not null,
  meaning_ru text not null,
  usage_note_ru text,
  examples jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  chunk_id uuid not null references chunks(id) on delete cascade,
  due_at timestamptz not null default now(),
  interval_days integer not null default 0,
  ease_factor numeric(4,2) not null default 2.50,
  repetitions integer not null default 0,
  last_score integer check (last_score between 0 and 100),
  last_reviewed_at timestamptz,
  unique (user_id, chunk_id)
);

create index reviews_due_idx on reviews (user_id, due_at);
create index chunks_deck_idx on chunks (deck_id);
