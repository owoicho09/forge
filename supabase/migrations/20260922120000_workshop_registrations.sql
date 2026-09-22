-- Workshop registrations CRM table.
-- Stores registrations for ForgeBuilds workshops (starting with the
-- Telegram job-finder bot workshop, workshop_id = 'telegrambot').

create table if not exists workshop_registrations (
  id uuid primary key default gen_random_uuid(),
  workshop_id text not null default 'telegrambot',
  name text not null,
  email text not null,
  email_normalized text generated always as (lower(trim(email))) stored,
  interest text not null check (interest in (
    'Building websites and apps with AI',
    'Building Telegram bots and AI agents',
    'AI automation and workflows',
    'Finding clients and selling digital services',
    'Building and launching my own digital product',
    'Using AI to improve my business'
  )),
  experience_level text not null check (experience_level in (
    'I''m completely new to it',
    'I''ve experimented with AI tools',
    'I''ve built a website or app with AI',
    'I''ve built bots or automations',
    'I''ve already launched a digital product'
  )),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  whatsapp_invite_clicked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (workshop_id, email_normalized)
);

create index if not exists workshop_registrations_interest_idx
  on workshop_registrations (workshop_id, interest);

create index if not exists workshop_registrations_experience_idx
  on workshop_registrations (workshop_id, experience_level);

-- RLS is enabled with no policies: only the service-role key (used
-- server-side only) can read or write this table.
alter table workshop_registrations enable row level security;
