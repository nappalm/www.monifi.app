create table if not exists public.stripe_customers (
    id bigint generated always as identity primary key,
    user_id uuid references auth.users(id) on delete cascade unique,
    stripe_customer_id text not null unique,
    created_at timestamp with time zone default current_timestamp
);

comment on table public.stripe_customers is 'Stores customer information from Stripe.';
comment on column public.stripe_customers.id is 'Unique identifier for the Stripe customer.';
comment on column public.stripe_customers.user_id is 'Foreign key to the users table in auth schema.';
comment on column public.stripe_customers.stripe_customer_id is 'The customer ID from Stripe.';
comment on column public.stripe_customers.created_at is 'Timestamp of when the customer was created.';

create table if not exists public.subscriptions (
    id bigint generated always as identity primary key,
    user_id uuid references auth.users(id) on delete cascade,
    stripe_customer_id text not null,
    stripe_subscription_id text not null unique,
    stripe_price_id text not null,
    product_name text,
    status text not null,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    canceled_at timestamp with time zone,
    created_at timestamp with time zone default current_timestamp
);

comment on table public.subscriptions is 'Stores subscription information for users.';
comment on column public.subscriptions.id is 'Unique identifier for the subscription.';
comment on column public.subscriptions.user_id is 'Foreign key to the users table in auth schema.';
comment on column public.subscriptions.stripe_customer_id is 'The customer ID from Stripe.';
comment on column public.subscriptions.stripe_subscription_id is 'The subscription ID from Stripe.';
comment on column public.subscriptions.stripe_price_id is 'The price ID from Stripe for the subscription plan.';
comment on column public.subscriptions.product_name is 'The name of the product associated with the subscription.';
comment on column public.subscriptions.status is 'The status of the subscription (e.g., active, canceled, past_due).';
comment on column public.subscriptions.current_period_start is 'The start date of the current billing period.';
comment on column public.subscriptions.current_period_end is 'The end date of the current billing period.';
comment on column public.subscriptions.canceled_at is 'Timestamp of when the subscription was canceled.';
comment on column public.subscriptions.created_at is 'Timestamp of when the subscription was created.';

alter table public.stripe_customers enable row level security;
alter table public.subscriptions enable row level security;

create policy "Allow view own stripe customer info"
on public.stripe_customers for select
using (auth.uid() = user_id);

create policy "Allow insert own stripe customer"
on public.stripe_customers for insert
with check (auth.uid() = user_id);

create policy "Allow view own subscriptions"
on public.subscriptions for select
using (auth.uid() = user_id);

create policy "Allow create own subscriptions"
on public.subscriptions for insert
with check (auth.uid() = user_id);

create index if not exists idx_stripe_customers_user_id on public.stripe_customers(user_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_subscription_id on public.subscriptions(stripe_subscription_id);

alter table public.subscriptions
add constraint fk_stripe_customer_id
foreign key (stripe_customer_id)
references public.stripe_customers(stripe_customer_id)
on delete cascade;
