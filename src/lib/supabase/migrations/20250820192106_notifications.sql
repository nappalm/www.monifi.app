DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        create type public.notification_type as enum ('error', 'info', 'warning');
    END IF;
END$$;

create table if not exists public.notifications (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.notification_type not null default 'info',
  title text,
  description text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.notifications is 'Stores notifications for users.';
comment on column public.notifications.id is 'Unique identifier for the notification.';
comment on column public.notifications.user_id is 'Foreign key to the users table in auth schema.';
comment on column public.notifications.type is 'The type of notification (e.g., error, info, warning).';
comment on column public.notifications.title is 'The title of the notification.';
comment on column public.notifications.description is 'The description of the notification.';
comment on column public.notifications.read_at is 'Timestamp of when the notification was read.';
comment on column public.notifications.created_at is 'Timestamp of when the notification was created.';

alter table public.notifications enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow select own notifications'
      AND polrelid = 'public.notifications'::regclass
  ) THEN
    CREATE POLICY "Allow select own notifications"
      ON public.notifications
      FOR SELECT
      USING (user_id = auth.uid());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow update own notifications'
      AND polrelid = 'public.notifications'::regclass
  ) THEN
    CREATE POLICY "Allow update own notifications"
      ON public.notifications
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
    WHERE polname = 'Allow delete own notifications'
      AND polrelid = 'public.notifications'::regclass
  ) THEN
    CREATE POLICY "Allow delete own notifications"
      ON public.notifications
      FOR DELETE
      USING (user_id = auth.uid());
  END IF;
END
$$;

BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
COMMIT;