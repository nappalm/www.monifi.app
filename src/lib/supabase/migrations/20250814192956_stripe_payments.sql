create table if not exists public.stripe_payments (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  stripe_invoice_id text not null unique,
  amount_paid numeric(10,2) not null,
  currency text not null,
  payment_method_brand text,
  payment_method_last4 text,
  paid_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

comment on table public.stripe_payments is 'Stores payment information from Stripe.';
comment on column public.stripe_payments.id is 'Unique identifier for the payment.';
comment on column public.stripe_payments.user_id is 'Foreign key to the users table in auth schema.';
comment on column public.stripe_payments.stripe_invoice_id is 'The invoice ID from Stripe.';
comment on column public.stripe_payments.amount_paid is 'The amount paid for the invoice.';
comment on column public.stripe_payments.currency is 'The currency of the payment.';
comment on column public.stripe_payments.payment_method_brand is 'The brand of the payment method (e.g., visa, mastercard).';
comment on column public.stripe_payments.payment_method_last4 is 'The last 4 digits of the payment method.';
comment on column public.stripe_payments.paid_at is 'Timestamp of when the payment was made.';
comment on column public.stripe_payments.created_at is 'Timestamp of when the payment record was created.';

create index if not exists idx_stripe_payments_user_id
  on public.stripe_payments(user_id);

alter table public.stripe_payments enable row level security;

create policy "Allow read own payments"
  on public.stripe_payments for select using (auth.uid() = user_id);