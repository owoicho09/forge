-- Post-workshop qualification for the AI Automation workshop
-- (/workshops/ai-automation/next-step). Additive only.
--
-- workshop_registrations stays the one lead record per person per workshop.
-- Each qualification submission is a row in workshop_qualifications linked to
-- that record, so repeat submissions keep history without duplicating people.

-- ---------------------------------------------------------------------------
-- Leads: phone number, and allow phone-only leads (people who never
-- registered and don't give an email). Existing rows all have an email.
-- ---------------------------------------------------------------------------
alter table workshop_registrations alter column email drop not null;

alter table workshop_registrations
  add column if not exists phone text,
  -- E.164 (e.g. +2348031234567), produced by lib/phone.ts. Used for matching.
  add column if not exists phone_normalized text;

alter table workshop_registrations
  drop constraint if exists workshop_registrations_contact_check,
  add constraint workshop_registrations_contact_check
    check (email is not null or phone_normalized is not null);

create index if not exists workshop_registrations_phone_idx
  on workshop_registrations (workshop_id, phone_normalized);

-- ---------------------------------------------------------------------------
-- Qualification submissions. Option values and labels live in
-- lib/workshops/ai-automation-qualification.ts. Don't change existing values.
-- ---------------------------------------------------------------------------
create table if not exists workshop_qualifications (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references workshop_registrations (id) on delete cascade,
  workshop_id text not null,

  -- Contact details as submitted (the lead record keeps its original values).
  name text not null,
  phone text not null,
  phone_normalized text not null,
  email text,

  -- How the person was matched to a lead record.
  match_type text not null check (match_type in (
    'existing_workshop_lead',
    'existing_crm_lead',
    'returning_community',
    'new_lead'
  )),
  source text not null default 'unknown'
    check (source in ('community', 'x', 'other', 'unknown')),

  primary_path text not null check (primary_path in (
    'learn_to_build', 'existing_project', 'idea_to_project', 'business_automation'
  )),

  -- Path A: learn to build
  learning_direction text check (learning_direction in (
    'ai_products', 'ai_automations', 'ai_integrations', 'not_sure'
  )),
  current_building_level text check (current_building_level in (
    'not_started', 'experimenting', 'struggling_to_finish', 'improving'
  )),
  -- Shared by paths A and C (their option sets don't overlap).
  support_need text check (support_need in (
    'practical_path', 'guidance_when_stuck', 'deeper_understanding', 'help_finishing',
    'figure_out_what', 'clear_plan', 'guided_build', 'technical_help'
  )),
  desired_outcome text check (desired_outcome in (
    'first_project', 'confidence', 'client_projects', 'future_business'
  )),
  contextual_notes text,

  -- Path B: existing project
  current_project text,
  project_stage text check (project_stage in (
    'early', 'prototype', 'mostly_working', 'stuck'
  )),
  current_blocker text check (current_blocker in (
    'ai_api_integration', 'automation_workflow', 'backend_data', 'debugging_integration', 'unsure'
  )),
  support_level text check (support_level in (
    'self_build', 'guided_build', 'technical_help', 'project_help'
  )),
  project_context text,

  -- Path C: idea to project
  project_idea text,
  idea_type text check (idea_type in (
    'product_saas', 'internal_tool', 'client_solution', 'not_sure'
  )),
  idea_stage text check (idea_stage in (
    'idea_only', 'planned', 'started_building', 'stuck'
  )),
  idea_context text,

  -- Path D: business automation
  automation_area text check (automation_area in (
    'customer_leads_sales', 'operations_admin', 'marketing_booking_processes', 'not_sure'
  )),
  current_automation_state text check (current_automation_state in (
    'manual', 'several_tools', 'some_automation', 'process_unclear'
  )),
  automation_goal text check (automation_goal in (
    'save_time', 'handle_customers', 'easier_process', 'not_sure'
  )),
  implementation_support text check (implementation_support in (
    'identify', 'design', 'teach', 'implement'
  )),
  business_automation_context text,
  business_relationship text check (business_relationship in (
    'own_business', 'employer', 'client', 'exploring'
  )),
  business_name text,

  -- All paths
  preferred_next_step text not null check (preferred_next_step in (
    'self_build_guidance', 'build_with_expert', 'implementation_help', 'exploring'
  )),
  follow_up_intent text not null check (follow_up_intent in (
    'discuss_next_step', 'help_with_project', 'not_yet'
  )),
  final_context text,

  -- Derived server-side for CRM filtering/counts (see deriveSupportCategory).
  support_category text not null check (support_category in (
    'self_guided', 'guided_build', 'technical_help', 'implementation', 'exploring'
  )),
  wants_follow_up boolean not null,

  -- Staff review status for this submission.
  status text not null default 'new'
    check (status in ('new', 'reviewed', 'contacted')),

  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workshop_qualifications_registration_idx
  on workshop_qualifications (registration_id, submitted_at desc);
create index if not exists workshop_qualifications_path_idx
  on workshop_qualifications (workshop_id, primary_path);
create index if not exists workshop_qualifications_support_idx
  on workshop_qualifications (workshop_id, support_category);
create index if not exists workshop_qualifications_follow_up_idx
  on workshop_qualifications (workshop_id, wants_follow_up);
create index if not exists workshop_qualifications_phone_idx
  on workshop_qualifications (workshop_id, phone_normalized);

create or replace function workshop_qualifications_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists workshop_qualifications_updated_at on workshop_qualifications;
create trigger workshop_qualifications_updated_at
  before update on workshop_qualifications
  for each row execute function workshop_qualifications_set_updated_at();

-- Same as workshop_registrations: RLS on with no policies, so only the
-- server-side service-role key can read or write.
alter table workshop_qualifications enable row level security;
