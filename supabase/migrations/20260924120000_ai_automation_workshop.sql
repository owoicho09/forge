-- AI Automation for Business workshop (workshop_id = 'ai-automation').
-- Additive only: existing registrations and columns are preserved.

-- The Telegram-bot questions don't apply to the new workshop. Their CHECK
-- constraints still validate any value that is set.
alter table workshop_registrations alter column interest drop not null;
alter table workshop_registrations alter column experience_level drop not null;

-- Pre-qualification answers (machine-readable values; labels live in
-- lib/workshops/ai-automation.ts). Nullable so other workshops are unaffected.
alter table workshop_registrations
  add column if not exists persona text,
  add column if not exists current_activity text,
  add column if not exists industry text,
  add column if not exists industry_other text,
  add column if not exists business_description text,
  add column if not exists ai_goal text,
  add column if not exists ai_goal_other text;

-- Normalized attribution bucket (raw campaign value stays in utm_source)
-- and manually-updated CRM pipeline status.
alter table workshop_registrations
  add column if not exists source text not null default 'unknown',
  add column if not exists status text not null default 'registered';

alter table workshop_registrations
  drop constraint if exists workshop_registrations_source_check,
  add constraint workshop_registrations_source_check
    check (source in ('community', 'x', 'other', 'unknown'));

alter table workshop_registrations
  drop constraint if exists workshop_registrations_status_check,
  add constraint workshop_registrations_status_check
    check (status in (
      'registered',
      'attended',
      'post_qualified',
      'consultation_requested',
      'consultation_completed'
    ));

create index if not exists workshop_registrations_source_idx
  on workshop_registrations (workshop_id, source);

create index if not exists workshop_registrations_status_idx
  on workshop_registrations (workshop_id, status);

create index if not exists workshop_registrations_persona_idx
  on workshop_registrations (workshop_id, persona);
