DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
        create type public.report_status as enum ('pending', 'resolved');
    END IF;
END$$;

create table if not exists public.reports (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  problem text not null,
  status public.report_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.reports is 'Stores user-reported problems from the web application.';
comment on column public.reports.id is 'Unique identifier for the report.';
comment on column public.reports.user_id is 'Foreign key to the user who submitted the report.';
comment on column public.reports.problem is 'Description of the problem.';
comment on column public.reports.status is 'Status of the report (pending or resolved).';
comment on column public.reports.created_at is 'Timestamp of when the report was created.';
comment on column public.reports.updated_at is 'Timestamp of when the report was last updated.';

-- Create index for faster queries
create index if not exists reports_user_id_idx on public.reports(user_id);
create index if not exists reports_status_idx on public.reports(status);
create index if not exists reports_created_at_idx on public.reports(created_at desc);

-- Enable Row Level Security
alter table public.reports enable row level security;

-- Policy: Users can view their own reports
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow users to view own reports'
      AND polrelid = 'public.reports'::regclass
  ) THEN
    CREATE POLICY "Allow users to view own reports"
      ON public.reports
      FOR SELECT
      USING (user_id = auth.uid());
  END IF;
END
$$;

-- Policy: Users can insert their own reports
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow users to insert reports'
      AND polrelid = 'public.reports'::regclass
  ) THEN
    CREATE POLICY "Allow users to insert reports"
      ON public.reports
      FOR INSERT
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

-- Policy: Users can update their own reports
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Allow users to update own reports'
      AND polrelid = 'public.reports'::regclass
  ) THEN
    CREATE POLICY "Allow users to update own reports"
      ON public.reports
      FOR UPDATE
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row updates
DROP TRIGGER IF EXISTS update_reports_updated_at ON public.reports;
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for reports table
BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
COMMIT;
