create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  name text,
  subscription text default 'FREE',
  currency text not null default 'en-US',
  language text not null default 'en',
  onboarding boolean not null default false,
  priority text,
  finance_management text,
  primary key (id)
);

comment on table public.profiles is 'Stores user profile information.';
comment on column public.profiles.id is 'User ID from auth.users table, serves as the primary key.';
comment on column public.profiles.name is 'User''s full name.';
comment on column public.profiles.subscription is 'User''s current subscription plan (e.g., FREE, PRO).';
comment on column public.profiles.currency is 'User''s preferred currency (e.g., USD, EUR).';
comment on column public.profiles.language is 'User''s preferred language (e.g., en, es).';
comment on column public.profiles.onboarding is 'Indicates whether the user has completed the onboarding process.';
comment on column public.profiles.priority is 'User''s financial priority.';
comment on column public.profiles.finance_management is 'How the user manages their finances.';

alter table public.profiles enable row level security;

drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user cascade;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow select own profile'
      AND polrelid = 'public.profiles'::regclass
  ) THEN
    CREATE POLICY "Allow select own profile"
      ON public.profiles
      FOR SELECT
      USING (id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow update own profile'
      AND polrelid = 'public.profiles'::regclass
  ) THEN
    CREATE POLICY "Allow update own profile"
      ON public.profiles
      FOR UPDATE
      USING (id = auth.uid())
      WITH CHECK (id = auth.uid());
  END IF;
END
$$;

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
COMMIT;
