-- Tabela de simulações
create table if not exists simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('ml', 'sh')),
  name text not null default 'Produto',
  data jsonb not null default '{}',
  created_at timestamptz default now()
);

-- RLS: cada usuário só vê as próprias simulações
alter table simulations enable row level security;

create policy "users can view own sims" on simulations
  for select using (auth.uid() = user_id);

create policy "users can insert own sims" on simulations
  for insert with check (auth.uid() = user_id);

create policy "users can delete own sims" on simulations
  for delete using (auth.uid() = user_id);

-- Index para performance
create index if not exists sims_user_id_idx on simulations(user_id);
create index if not exists sims_created_at_idx on simulations(created_at desc);
