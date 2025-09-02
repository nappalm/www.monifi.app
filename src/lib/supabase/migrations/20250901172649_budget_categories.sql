create table if not exists public.budget_categories (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  budget_id bigint not null references public.budgets(id) on delete cascade,
  category_id bigint not null references public.categories(id) on delete cascade,
  amount numeric(12, 2) not null default 0,
  description text,
  created_at timestamp with time zone not null default current_timestamp,
  constraint budget_categories_budget_id_category_id_key unique (budget_id, category_id)
);

comment on table public.budget_categories is 'Associates categories with specific budgets, allowing for detailed budget planning.';
comment on column public.budget_categories.id is 'Unique identifier for the budget-category link.';
comment on column public.budget_categories.user_id is 'Foreign key to the users table for RLS.';
comment on column public.budget_categories.budget_id is 'Foreign key to the budget being detailed.';
comment on column public.budget_categories.category_id is 'Foreign key to the category being assigned to the budget.';
comment on column public.budget_categories.amount is 'The allocated amount for this specific category within the budget.';
comment on column public.budget_categories.description is 'A description for this budget category allocation.';
comment on column public.budget_categories.created_at is 'Timestamp of when the budget-category link was created.';

alter table public.budget_categories enable row level security;

create index if not exists idx_budget_categories_user_id on public.budget_categories(user_id);
create index if not exists idx_budget_categories_budget_id on public.budget_categories(budget_id);
create index if not exists idx_budget_categories_category_id on public.budget_categories(category_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow select own budget_categories'
      AND polrelid = 'public.budget_categories'::regclass
  ) THEN
    CREATE POLICY "Allow select own budget_categories"
      ON public.budget_categories
      FOR SELECT
      USING (user_id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow insert own budget_categories'
      AND polrelid = 'public.budget_categories'::regclass
  ) THEN
    CREATE POLICY "Allow insert own budget_categories"
      ON public.budget_categories
      FOR INSERT
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow update own budget_categories'
      AND polrelid = 'public.budget_categories'::regclass
  ) THEN
    CREATE POLICY "Allow update own budget_categories"
      ON public.budget_categories
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
    WHERE polname = 'Allow delete own budget_categories'
      AND polrelid = 'public.budget_categories'::regclass
  ) THEN
    CREATE POLICY "Allow delete own budget_categories"
      ON public.budget_categories
      FOR DELETE
      USING (user_id = auth.uid());
  END IF;
END
$$;

BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.budget_categories;
COMMIT;
