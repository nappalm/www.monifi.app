create table public.monthly_summaries (
  user_id uuid not null default auth.uid(),
  year numeric not null default '2026'::numeric,
  month numeric not null default '1'::numeric,
  income_total numeric null default '0'::numeric,
  expense_total numeric null default '0'::numeric,
  constraint monthly_summaries_pkey primary key (user_id, year, month),
  constraint monthly_summaries_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade
) tablespace pg_default;

-- Enable Row Level Security
alter table public.monthly_summaries enable row level security;

-- Policy: users can only access their own summaries
create policy "Users can view their own monthly summaries"
  on public.monthly_summaries
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own monthly summaries"
  on public.monthly_summaries
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own monthly summaries"
  on public.monthly_summaries
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own monthly summaries"
  on public.monthly_summaries
  for delete
  using (auth.uid() = user_id);

-- Index for faster lookups by user
create index monthly_summaries_user_id_idx on public.monthly_summaries (user_id);
