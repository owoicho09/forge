# Build: /hospital-system landing page

Add a page to the Forge site at `/hospital-system`.

It's the destination for a paid X ad. Someone watches a 60-second demo of the system in their feed, taps through on their phone, and lands here. They run a hospital or clinic in Nigeria. One question: *is this real, and can I get it?*

Short page. The video does the selling. Get them to WhatsApp.

---

## Reuse what exists

This lives inside the existing Forge site — same typography, colour tokens, buttons, cards, nav, footer. Don't invent a new visual language.

Where the page needs weight, the "Product of the week" featured card on the homepage is the right register: dark panel, orange accent, tight lines. Match it.

---

## Keep it short — but not thin

Video, then about a screen and a half, then out. This audience is on a phone and won't scroll a sales page.

But short is not thin. Ad platforms reject pages that exist only to bounce people into a messaging app — that's what got the last campaign flagged. What clears review is **specificity and identity**, not length: real product detail, a real business behind it, honest disclosure. The copy below has all three. Don't pad it, and don't strip it.

---

## The copy — use exactly as written

### Hero

> # Hospital management system.
>
> Registration, nursing, doctors, laboratory and pharmacy — one patient record across every department.

Then the demo video, prominent. Then the WhatsApp button.

Three seconds of reading before they reach the video. That's the budget.

### How it works

Five departments. Name in one weight, description in another — visually distinct, scannable, not prose.

> **Records / Front desk**
> Registers the patient, issues the hospital number, opens the visit. Sends them to nursing.
>
> **Nursing**
> Records vitals and the presenting complaint against the visit. Sends the patient to a clinician.
>
> **Clinician**
> Opens the file with the history already summarised. Examines, records the diagnosis, requests tests, prescribes.
>
> **Laboratory**
> Receives the request instantly with the clinician's note attached. Enters results, sends them back.
>
> **Pharmacy**
> Receives the prescription before the patient arrives. Dispenses and records it.
>
> Everything each department does writes to the same patient record.

That closing line matters — without it this reads as five separate tools instead of one system. Set it apart from the list.

On desktop, a light connector or arrow between departments makes the handoff readable at a glance without adding words. On mobile they stack.

### What it does

> - One permanent record per patient — every visit, vital sign, result and prescription, findable by name, phone or hospital number
> - Requests reach other departments instantly, with the sender's note attached
> - Each department gets its own workspace and its own queue
> - Departments configured by the hospital, not fixed in code
> - AI summarises a patient's history so a clinician reads years of record in seconds
> - Patient contact by WhatsApp and email, logged to the record
> - Built-in recruitment — post a vacancy, AI-screened applications, shortlist, hire

### The honest note

Set this off — light background or a border. It should read as a deliberate statement, not fine print. Small type, but clearly placed.

> Everything in the demo above uses simulated patient data. The system doesn't diagnose, prescribe independently, or predict disease — every clinical decision is made by a person.

### Close

> Built for private hospitals and clinics in Nigeria. Configured to your departments and workflow.
>
> Message to discuss what it would take for yours.

Then the second WhatsApp button.

That's the whole page. Nothing else.

---

## The CTA

Both buttons, same link, opens WhatsApp with a prefilled message:

```
https://wa.me/2349165092953?text=Saw%20the%20hospital%20system.%20I%27d%20like%20to%20talk%20about%20building%20something%20similar%20for%20...
```

Label: **Message on WhatsApp**, with the WhatsApp icon. Use the site's existing WhatsApp button styling.

Two CTAs only — one under the video, one at the end.

---

## Footer

Standard site footer. Must include, visibly:

> **FORGE.**
> Part of Forge — Build. Buy. Deploy.
> Forge Home · Terms & Conditions · Privacy Policy
> © 2026 FORGE. All rights reserved.

Links go to `/`, `/terms`, `/privacy` on the main site. These matter for ad review — they're what shows a real business sits behind the page.

---

## Build notes

**Mobile first.** Nearly all this traffic arrives on a phone from the feed. The video must be visible and playable immediately — no pinching, no scrolling to find it. Fast on Nigerian mobile data, so keep the page light: no heavy libraries, no unnecessary images, lazy-load anything below the fold.

Leave the video embed as a clearly marked placeholder for the Loom URL.

Set page metadata properly — title, description, and an Open Graph image so the link previews correctly when shared.

Nav links back to the main Forge site, so the page is visibly part of a real business rather than a standalone landing page.

---

## Done means

A hospital owner in Lagos taps the ad, watches the demo, scrolls maybe twice, and messages on WhatsApp already knowing what they want to ask.
