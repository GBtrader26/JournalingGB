create table if not exists public.trades (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(), trade_date date not null default current_date,
 symbol text not null, direction text not null check(direction in ('LONG','SHORT')),
 entry numeric, exit numeric, stop_loss numeric, take_profit numeric, risk_percent numeric default 1,
 position_size numeric, setup text, session text, result_r numeric default 0, pnl numeric default 0,
 notes text, psychology text);
alter table public.trades enable row level security;
create policy "own select" on public.trades for select using (auth.uid()=user_id);
create policy "own insert" on public.trades for insert with check (auth.uid()=user_id);
create policy "own update" on public.trades for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own delete" on public.trades for delete using (auth.uid()=user_id);
create index if not exists trades_user_id_idx on public.trades(user_id);
