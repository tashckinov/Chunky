create table admin_sessions (
  id text primary key,
  data jsonb not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create index admin_sessions_expires_idx on admin_sessions (expires_at);
