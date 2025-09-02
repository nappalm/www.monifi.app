create table if not exists public.accounts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null,
  color text,
  created_at timestamp with time zone not null default current_timestamp
);

comment on table public.accounts is 'Stores user accounts for managing money.';
comment on column public.accounts.id is 'Unique identifier for the account.';
comment on column public.accounts.user_id is 'Foreign key to the users table in auth schema.';
comment on column public.accounts.name is 'The name of the account (e.g., Savings, Checking).';
comment on column public.accounts.type is 'The type of account (e.g., Bank, Cash).';
comment on column public.accounts.color is 'A color associated with the account for UI purposes.';
comment on column public.accounts.created_at is 'Timestamp of when the account was created.';

alter table public.accounts enable row level security;

create index if not exists idx_accounts_user_id on public.accounts(user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow select own accounts'
      AND polrelid = 'public.accounts'::regclass
  ) THEN
    CREATE POLICY "Allow select own accounts"
      ON public.accounts
      FOR SELECT
      USING (user_id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow insert own accounts'
      AND polrelid = 'public.accounts'::regclass
  ) THEN
    CREATE POLICY "Allow insert own accounts"
      ON public.accounts
      FOR INSERT
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow update own accounts'
      AND polrelid = 'public.accounts'::regclass
  ) THEN
    CREATE POLICY "Allow update own accounts"
      ON public.accounts
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
    WHERE polname = 'Allow delete own accounts'
      AND polrelid = 'public.accounts'::regclass
  ) THEN
    CREATE POLICY "Allow delete own accounts"
      ON public.accounts
      FOR DELETE
      USING (user_id = auth.uid());
  END IF;
END
$$;

BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.accounts;
COMMIT;
