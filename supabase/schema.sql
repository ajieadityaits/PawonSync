create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('seller', 'buyer')),
  full_name text,
  phone text,
  email text,
  catering_name text,
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_user_id_idx
  on public.profiles(user_id);

create table if not exists public.menus (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  price integer not null default 0,
  minimum_order integer not null default 1,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.profiles(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete set null,
  event_name text,
  buyer_name text not null,
  buyer_phone text,
  menu_name text not null,
  portions integer not null,
  event_date date not null,
  delivery_time time not null,
  venue_address text not null,
  notes text,
  status text not null default 'pesanan_masuk'
    check (status in ('pesanan_masuk', 'diproses', 'dimasak', 'dikemas', 'dikirim', 'selesai')),
  estimated_arrival text,
  created_at timestamptz not null default now()
);

alter table public.orders
  add column if not exists event_name text;

create table if not exists public.order_status_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  status text not null check (status in ('pesanan_masuk', 'diproses', 'dimasak', 'dikemas', 'dikirim', 'selesai')),
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.menus enable row level security;
alter table public.orders enable row level security;
alter table public.order_status_logs enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Prototype can read menus" on public.menus;
create policy "Prototype can read menus"
  on public.menus
  for select
  using (true);

drop policy if exists "Prototype can create menus" on public.menus;
create policy "Prototype can create menus"
  on public.menus
  for insert
  with check (true);

drop policy if exists "Prototype can update menus" on public.menus;
create policy "Prototype can update menus"
  on public.menus
  for update
  using (true)
  with check (true);

drop policy if exists "Prototype can delete menus" on public.menus;
create policy "Prototype can delete menus"
  on public.menus
  for delete
  using (true);

drop policy if exists "Prototype can read orders" on public.orders;
create policy "Prototype can read orders"
  on public.orders
  for select
  using (true);

drop policy if exists "Prototype can create orders" on public.orders;
create policy "Prototype can create orders"
  on public.orders
  for insert
  with check (true);

drop policy if exists "Prototype can update orders" on public.orders;
create policy "Prototype can update orders"
  on public.orders
  for update
  using (true)
  with check (true);

drop policy if exists "Prototype can delete orders" on public.orders;
create policy "Prototype can delete orders"
  on public.orders
  for delete
  using (true);

drop policy if exists "Prototype can read order logs" on public.order_status_logs;
create policy "Prototype can read order logs"
  on public.order_status_logs
  for select
  using (true);

drop policy if exists "Prototype can create order logs" on public.order_status_logs;
create policy "Prototype can create order logs"
  on public.order_status_logs
  for insert
  with check (true);

drop policy if exists "Prototype can read notifications" on public.notifications;
create policy "Prototype can read notifications"
  on public.notifications
  for select
  using (true);

drop policy if exists "Prototype can create notifications" on public.notifications;
create policy "Prototype can create notifications"
  on public.notifications
  for insert
  with check (true);

drop policy if exists "Prototype can update notifications" on public.notifications;
create policy "Prototype can update notifications"
  on public.notifications
  for update
  using (true)
  with check (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    user_id,
    role,
    full_name,
    phone,
    email,
    catering_name
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'buyer'),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    new.email,
    new.raw_user_meta_data->>'catering_name'
  )
  on conflict (user_id) do update
  set
    role = excluded.role,
    full_name = excluded.full_name,
    phone = excluded.phone,
    email = excluded.email,
    catering_name = excluded.catering_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
