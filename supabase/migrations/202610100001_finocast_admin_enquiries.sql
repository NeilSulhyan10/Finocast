create extension if not exists pgcrypto;

create sequence if not exists public.enquiry_reference_seq;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default (
    'FC-' || to_char(now(), 'YY') || '-' || lpad(nextval('public.enquiry_reference_seq')::text, 6, '0')
  ),
  source text not null check (source in ('contact', 'quote')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
  full_name text not null check (char_length(full_name) between 2 and 100),
  company_name text check (company_name is null or char_length(company_name) <= 150),
  email text not null check (char_length(email) <= 254),
  telephone text check (telephone is null or char_length(telephone) <= 30),
  subject text check (subject is null or char_length(subject) <= 200),
  message text not null check (char_length(message) between 1 and 5000),
  internal_notes text not null default '' check (char_length(internal_notes) <= 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_details (
  enquiry_id uuid primary key references public.enquiries (id) on delete cascade,
  component_description text not null check (char_length(component_description) between 10 and 5000),
  material_grade text not null default '' check (char_length(material_grade) <= 100),
  approximate_weight text not null default '' check (char_length(approximate_weight) <= 50),
  required_quantity text not null default '' check (char_length(required_quantity) <= 50),
  additional_requirements text not null default '' check (char_length(additional_requirements) <= 5000)
);

create table if not exists public.quote_upload_batches (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  state text not null default 'pending' check (state in ('pending')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quote_attachments (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid references public.enquiries (id) on delete cascade,
  upload_batch_id uuid references public.quote_upload_batches (id) on delete cascade,
  storage_path text not null unique,
  file_name text not null check (char_length(file_name) between 1 and 255),
  content_type text not null,
  file_size_bytes bigint not null check (file_size_bytes between 1 and 10485760),
  created_at timestamptz not null default now(),
  check ((enquiry_id is not null and upload_batch_id is null) or (enquiry_id is null and upload_batch_id is not null)),
  check (content_type in (
    'application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/tiff',
    'application/dxf', 'application/acad', 'application/step', 'model/step',
    'application/iges', 'model/iges', 'application/octet-stream'
  ))
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_source_status_created_at_idx on public.enquiries (source, status, created_at desc);
create index if not exists enquiries_email_idx on public.enquiries (lower(email));
create index if not exists enquiries_reference_idx on public.enquiries (reference);
create index if not exists quote_attachments_enquiry_id_idx on public.quote_attachments (enquiry_id);
create index if not exists quote_attachments_upload_batch_id_idx on public.quote_attachments (upload_batch_id);
create index if not exists quote_upload_batches_expiry_idx on public.quote_upload_batches (expires_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists enquiries_set_updated_at on public.enquiries;
create trigger enquiries_set_updated_at
before update on public.enquiries
for each row execute function public.set_updated_at();

create or replace function public.is_finocast_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_finocast_admin() from public;
grant execute on function public.is_finocast_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.enquiries enable row level security;
alter table public.quote_details enable row level security;
alter table public.quote_upload_batches enable row level security;
alter table public.quote_attachments enable row level security;

drop policy if exists "Admins can read their own admin membership" on public.admin_users;
create policy "Admins can read their own admin membership"
on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries"
on public.enquiries for select to authenticated
using (public.is_finocast_admin());

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries"
on public.enquiries for update to authenticated
using (public.is_finocast_admin()) with check (public.is_finocast_admin());

drop policy if exists "Admins can delete enquiries" on public.enquiries;
create policy "Admins can delete enquiries"
on public.enquiries for delete to authenticated
using (public.is_finocast_admin());

drop policy if exists "Admins can read quote details" on public.quote_details;
create policy "Admins can read quote details"
on public.quote_details for select to authenticated
using (public.is_finocast_admin());

drop policy if exists "Admins can read quote attachments" on public.quote_attachments;
create policy "Admins can read quote attachments"
on public.quote_attachments for select to authenticated
using (public.is_finocast_admin());

drop policy if exists "Admins can delete quote attachments" on public.quote_attachments;
create policy "Admins can delete quote attachments"
on public.quote_attachments for delete to authenticated
using (public.is_finocast_admin());

grant select, update, delete on public.enquiries to authenticated;
grant select on public.admin_users, public.quote_details, public.quote_attachments to authenticated;
grant all on public.enquiries, public.quote_details, public.quote_upload_batches, public.quote_attachments to service_role;
grant usage, select on sequence public.enquiry_reference_seq to service_role;

create or replace function public.finalize_quote_enquiry(p_token_hash text, p_fields jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_batch public.quote_upload_batches%rowtype;
  v_enquiry public.enquiries%rowtype;
  v_expected integer := coalesce((p_fields->>'attachment_count')::integer, 0);
  v_reserved integer := 0;
begin
  if p_token_hash is not null then
    select * into v_batch
    from public.quote_upload_batches
    where token_hash = p_token_hash and state = 'pending' and expires_at > now()
    for update;
    if not found then raise exception 'Upload session is invalid or expired'; end if;
    select count(*) into v_reserved from public.quote_attachments where upload_batch_id = v_batch.id;
    if v_reserved <> v_expected then raise exception 'Attachment count does not match upload session'; end if;
  elsif v_expected <> 0 then
    raise exception 'Attachments require an upload session';
  end if;

  insert into public.enquiries (source, full_name, company_name, email, telephone, message)
  values (
    'quote', p_fields->>'full_name', nullif(p_fields->>'company_name', ''),
    p_fields->>'email', nullif(p_fields->>'telephone', ''), p_fields->>'component_description'
  ) returning * into v_enquiry;

  insert into public.quote_details (enquiry_id, component_description, material_grade, approximate_weight, required_quantity, additional_requirements)
  values (
    v_enquiry.id, p_fields->>'component_description', coalesce(p_fields->>'material_grade', ''),
    coalesce(p_fields->>'approximate_weight', ''), coalesce(p_fields->>'required_quantity', ''),
    coalesce(p_fields->>'additional_requirements', '')
  );

  if p_token_hash is not null then
    update public.quote_attachments set enquiry_id = v_enquiry.id, upload_batch_id = null
    where upload_batch_id = v_batch.id;
    delete from public.quote_upload_batches where id = v_batch.id;
  end if;

  return jsonb_build_object('id', v_enquiry.id, 'reference', v_enquiry.reference);
end;
$$;

revoke all on function public.finalize_quote_enquiry(text, jsonb) from public, anon, authenticated;
grant execute on function public.finalize_quote_enquiry(text, jsonb) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'quote-attachments', 'quote-attachments', false, 10485760,
  array[
    'application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/tiff',
    'application/dxf', 'application/acad', 'application/step', 'model/step',
    'application/iges', 'model/iges', 'application/octet-stream'
  ]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Finocast admins access quote files" on storage.objects;
create policy "Finocast admins access quote files"
on storage.objects for all to authenticated
using (bucket_id = 'quote-attachments' and public.is_finocast_admin())
with check (bucket_id = 'quote-attachments' and public.is_finocast_admin());
