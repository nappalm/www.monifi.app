DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');
    END IF;
END$$;

create table if not exists public.transactions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id bigint not null references public.accounts(id) on delete cascade,
  category_id bigint references public.categories(id) on delete set null,
  type public.transaction_type not null,
  amount numeric(12, 2) not null default 0,
  description text,
  occurred_at timestamp with time zone not null default current_timestamp,
  created_at timestamp with time zone not null default current_timestamp
);

comment on table public.transactions is 'Stores individual financial transactions.';
comment on column public.transactions.id is 'Unique identifier for the transaction.';
comment on column public.transactions.user_id is 'Foreign key to the users table in auth schema.';
comment on column public.transactions.account_id is 'Foreign key to the account this transaction belongs to.';
comment on column public.transactions.category_id is 'Foreign key to the category this transaction falls under.';
comment on column public.transactions.type is 'The type of transaction (income or expense).';
comment on column public.transactions.amount is 'The monetary value of the transaction.';
comment on column public.transactions.description is 'A description of the transaction.';
comment on column public.transactions.occurred_at is 'Timestamp of when the transaction actually happened.';
comment on column public.transactions.created_at is 'Timestamp of when the transaction was recorded.';

alter table public.transactions enable row level security;

create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_account_id on public.transactions(account_id);
create index if not exists idx_transactions_category_id on public.transactions(category_id);
create index if not exists transactions_user_id_occurred_at_idx on public.transactions(user_id, occurred_at desc);


DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow select own transactions'
      AND polrelid = 'public.transactions'::regclass
  ) THEN
    CREATE POLICY "Allow select own transactions"
      ON public.transactions
      FOR SELECT
      USING (user_id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow insert own transactions'
      AND polrelid = 'public.transactions'::regclass
  ) THEN
    CREATE POLICY "Allow insert own transactions"
      ON public.transactions
      FOR INSERT
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow update own transactions'
      AND polrelid = 'public.transactions'::regclass
  ) THEN
    CREATE POLICY "Allow update own transactions"
      ON public.transactions
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
    WHERE polname = 'Allow delete own transactions'
      AND polrelid = 'public.transactions'::regclass
  ) THEN
    CREATE POLICY "Allow delete own transactions"
      ON public.transactions
      FOR DELETE
      USING (user_id = auth.uid());
  END IF;
END
$$;

BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
COMMIT;
