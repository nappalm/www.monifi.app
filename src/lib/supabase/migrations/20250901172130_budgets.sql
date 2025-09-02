DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'budget_repeat') THEN
        CREATE TYPE public.budget_repeat AS ENUM ('day', 'week', 'month', 'year');
    END IF;
END$$;

create table if not exists public.budgets (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(12, 2) not null default 0 check (amount >= 0),
  repeat public.budget_repeat not null default 'month',
  initial_date date,
  end_date date,
  active boolean not null default true,
  created_at timestamp with time zone not null default current_timestamp
);

comment on table public.budgets is 'Stores user-defined budgets for tracking expenses.';
comment on column public.budgets.id is 'Unique identifier for the budget.';
comment on column public.budgets.user_id is 'Foreign key to the users table in auth schema.';
comment on column public.budgets.name is 'The name of the budget (e.g., Groceries, Entertainment).';
comment on column public.budgets.amount is 'The allocated amount for the budget.';
comment on column public.budgets.repeat is 'The frequency the budget repeats (day, week, month, year).';
comment on column public.budgets.initial_date is 'The start date of the budget period.';
comment on column public.budgets.end_date is 'The end date of the budget period.';
comment on column public.budgets.active is 'Indicates if the budget is currently active.';
comment on column public.budgets.created_at is 'Timestamp of when the budget was created.';

alter table public.budgets enable row level security;

create index if not exists idx_budgets_user_id on public.budgets(user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow select own budgets'
      AND polrelid = 'public.budgets'::regclass
  ) THEN
    CREATE POLICY "Allow select own budgets"
      ON public.budgets
      FOR SELECT
      USING (user_id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow insert own budgets'
      AND polrelid = 'public.budgets'::regclass
  ) THEN
    CREATE POLICY "Allow insert own budgets"
      ON public.budgets
      FOR INSERT
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow update own budgets'
      AND polrelid = 'public.budgets'::regclass
  ) THEN
    CREATE POLICY "Allow update own budgets"
      ON public.budgets
      FOR UPDATE
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow delete own budgets'
      AND polrelid = 'public.budgets'::regclass
  ) THEN
    CREATE POLICY "Allow delete own budgets"
      ON public.budgets
      FOR DELETE
      USING (user_id = auth.uid());
  END IF;
END
$$;

BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.budgets;
COMMIT;
