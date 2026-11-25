---
name: gtm-content-loop
description: Run a full social go-to-market loop for any product. Research, create 3 short videos with 3 different hooks, publish on Instagram through the Zernio MCP, wire one comment-to-DM automation per post, measure, then learn and adjust. Use when the user says "new batch", "measure", "setup gtm loop" or asks for a comment-to-DM growth loop. Measures every 48 hours and iterates on what worked. First run asks a few questions and saves a local config.
---

# Social GTM loop

One order ("new batch") runs the whole loop. The skill is generic: everything specific to your product lives in a local config file created on first use.

## Step 0. Setup (first run, or when asked to "reconfigure")

Look for `gtm-loop.config.json` in the current project folder.

- If it exists: read it and use it. Never ask again for what it already holds.
- If it does not exist: interview the user (one short question at a time, propose defaults), then write the file. Use `config.example.json` next to this skill as the schema.

Fields to collect:

| Field | Question |
|---|---|
| `product` | What do you sell, in one sentence? |
| `audience` | Who watches and comments? |
| `persona` | Fictional character or brand voice: name, tone, one visible flaw. |
| `keyword` | One word people comment to receive the DM (ex: GUIDE). |
| `landing_url` | Destination page (waitlist, signup, booking). |
| `language` | Language of videos, captions and DMs. |
| `instagram_account` | Which Instagram account publishes. Check Zernio for the account id and store it in the local config only. |
| `video_format` | `remotion-call` (template included), `custom` (user provides MP4s) or `none` (text and image posts). |
| `hook_pattern` | Hook template, default: "If you're [situation], listen to [persona]." |
| `measure_interval_hours` | Delay between measure cycles, default `48`. |

Also check prerequisites and tell the user what is missing, without installing anything unasked:
- Zernio MCP connected (tools for media upload, posts, automations, inbox, analytics). If absent, stop and explain how to connect it.
- For `remotion-call`: Node, Python 3, a full ffmpeg and ffprobe (the one bundled with Remotion is not enough). See `templates/video-remotion/`.

Then create `gtm-loop.journal.md` from `references/journal-template.md` if it does not exist, and generate the DM persona prompt from `references/dm-persona-template.md` filled with the config values, and save it as `gtm-dm-persona-prompt.md`.

Add `gtm-loop.config.json` to `.gitignore` if the project is a git repo (it holds account ids).

## The loop

### 1. Research
Cross 4 sources before writing anything:
- Competitors: what similar products post, and the angle nobody owns.
- Inspiration: a reference account and what works on its recent posts.
- Zernio stats: analytics, comments and inbox of past posts.
- Project context: the config, previous journal lines, learned rules.

If stats are too thin to decide (a few comments, zero clicks), say so in the journal. Never invent a trend.

### 2. Create
- Pick ONE topic: a concrete, useful tip for the audience.
- Write 3 variants identical except the hook: A, B, C.
- With `remotion-call`: ringing screen with the hook, the persona picks up, 3 tips in bubbles, a twist, CTA "Comment {keyword}", hang up (about 24 s, 1080x1920). Build with `templates/video-remotion/` (script JSON, then `gen_voice.py`, `make_assets.py`, Remotion render).
- The persona images are not shipped. Ask the user to generate them (see the template README) and never use a real face.

### 3. Publish
- Upload the media through Zernio, then create the Instagram post on the configured account.
- Caption: hook on the first line, the tips, CTA "Comment {keyword}", and a note that the character is fictional if the persona is.
- Verify the status is "published" before moving on. Re-check the account id before every publication.
- Write the publication time in the journal and tell the user the first measure is due `measure_interval_hours` later (48 h by default). Never measure earlier: fresh posts have no usable data.
- Offer to create the recurring measure task (see "Measure and iterate cycle"). Create it only if the user says yes.

### 4. Capture
One comment-to-DM automation per post, never one for all:
- Trigger: comment containing the keyword, typo tolerant.
- DM signed by the persona: one sentence reacting to the comment, a mini action plan, a promise (call, access, resource).
- Button to `landing_url` with a unique `?ref=` per post (ex: `p3-hookA`).
- Short public reply under the comment, in the persona's tone.
- Tag the contact when they click.

Optional: a DM workflow with an AI node that keeps replying without Claude, using the generated persona prompt.

### 5. Measure and 6. Learn: see the cycle below

## Measure and iterate cycle (every 48 hours)

Triggered by the user saying "measure", or by a recurring task created with the user's consent (interval = `measure_interval_hours`, default 48 h). Suggested task prompt: "measure and iterate with the gtm-content-loop skill".

1. **Select posts.** Only posts published at least 48 h ago and not yet measured in their current window. Skip younger ones and say when they will be ready.
2. **Collect.** Through the Zernio MCP, read per post: views, retention, comments, DMs sent, clicks per `ref`, and signups per ref if the landing counts them.
3. **Analyze on real data only.**
   - Rank the posts, and the 3 hooks of each batch, by the metric that matters most for the goal: signups per ref, then clicks, then DMs, then comments, then retention.
   - Name what worked and what did not, with the numbers and the reason when the data supports one.
   - If data is too thin to rank (a few comments, zero clicks), write that in the journal, create no variants, and wait for the next cycle. Never invent a trend.
4. **Iterate on winners.** Take the best content (hook, topic, pacing, keyword) and prepare 3 variants. Change one element per variant (hook wording, pacing, angle on the same topic, CTA) so the next comparison stays readable. Do not repeat what lost.
5. **Prepare, do not publish.** Build the videos and captions, define one comment-to-DM automation and one unique `ref` per variant, and save everything in `gtm-loop.pending.md` (what each variant changes, why, and the data behind it).
6. **Ask for approval.** Show the pending variants to the user. Publish only what they approve, then follow steps 3 and 4 of the loop. In an unattended scheduled run, stop after step 5 and leave the pending file for the user.
7. **Log.** Add a cycle entry to the journal: date, posts measured, results, 2 or 3 concrete rules learned (hook, pacing, keyword, topic), and the next measure date. The next batch applies these rules.

## Journal

One line per post in `gtm-loop.journal.md`: time, account, post, persona, format, hook, keyword, ref, results. Never delete previous lines.

## Hard rules

- Never publish without the user's explicit approval, including variants from the measure cycle. A scheduled run only measures, analyzes and prepares.
- Measure no earlier than `measure_interval_hours` after publication.
- No invented numbers. Analysis uses Zernio data only. Test numbers are not traction.
- One publishing account. Verify the account id before each publication.
- Always ask before deleting anything.
- Fictional persona, never a real face, never a real quote attributed to a real person, do not name the real people it parodies.
- No long dashes in public texts.
- Simplest thing that works.
