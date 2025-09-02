create table if not exists public.categories (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#000000',
  created_at timestamp with time zone not null default current_timestamp
);

comment on table public.categories is 'Stores user-defined categories for transactions.';
comment on column public.categories.id is 'Unique identifier for the category.';
comment on column public.categories.user_id is 'Foreign key to the users table in auth schema.';
comment on column public.categories.name is 'The name of the category (e.g., Food, Rent, Salary).';
comment on column public.categories.color is 'A color associated with the category for UI purposes.';
comment on column public.categories.created_at is 'Timestamp of when the category was created.';

alter table public.categories enable row level security;

create index if not exists idx_categories_user_id on public.categories(user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow select own categories'
      AND polrelid = 'public.categories'::regclass
  ) THEN
    CREATE POLICY "Allow select own categories"
      ON public.categories
      FOR SELECT
      USING (user_id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow insert own categories'
      AND polrelid = 'public.categories'::regclass
  ) THEN
    CREATE POLICY "Allow insert own categories"
      ON public.categories
      FOR INSERT
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow update own categories'
      AND polrelid = 'public.categories'::regclass
  ) THEN
    CREATE POLICY "Allow update own categories"
      ON public.categories
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
    WHERE polname = 'Allow delete own categories'
      AND polrelid = 'public.categories'::regclass
  ) THEN
    CREATE POLICY "Allow delete own categories"
      ON public.categories
      FOR DELETE
      USING (user_id = auth.uid());
  END IF;
END
$$;

BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
COMMIT;
