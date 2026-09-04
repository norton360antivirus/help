-- Norton Help: Supabase database + security
create table if not exists public.cancellation_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  amount numeric(12,2) not null default 0,
  bank_name text not null,
  device text not null,
  cancellation_choice text not null,
  details text,
  status text not null default 'Pending'
    check (status in ('Pending','Processing','Completed','Rejected'))
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.cancellation_requests enable row level security;
alter table public.admin_users enable row level security;

-- Anyone may submit a request. They cannot read or modify requests.
drop policy if exists "public can submit cancellation requests" on public.cancellation_requests;
create policy "public can submit cancellation requests"
on public.cancellation_requests for insert
to anon, authenticated
with check (true);

-- Only users explicitly added to admin_users may read/update requests.
drop policy if exists "admins can read requests" on public.cancellation_requests;
create policy "admins can read requests"
on public.cancellation_requests for select
to authenticated
using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "admins can update requests" on public.cancellation_requests;
create policy "admins can update requests"
on public.cancellation_requests for update
to authenticated
using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

-- Admin membership itself is not publicly readable/writable.
drop policy if exists "admins can read own admin row" on public.admin_users;
create policy "admins can read own admin row"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

-- After creating an admin Auth user, run:
-- insert into public.admin_users(user_id) values ('THE_AUTH_USER_UUID');

-- Recommended: enable email/password Auth in Supabase Authentication settings.
