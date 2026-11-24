---
name: gtm-content-loop
description: Run a full social go-to-market loop for any product. Research, create 3 short videos with 3 different hooks, publish on Instagram through the Zernio MCP, wire one comment-to-DM automation per post, measure, then learn and adjust. Use when the user says "new batch", "setup gtm loop" or asks for a comment-to-DM growth loop. First run asks a few questions and saves a local config.
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

Also check prerequisites and tell the user what is missing, without installing anything unasked:
- Zernio MCP connected (tools for media upload, posts, automations, inbox, analytics). If absent, stop and explain how to connect it.
- For `remotion-call`: Node, Python 3, a full ffmpeg and ffprobe (the one bundled with Remotion is not enough). See `templates/video-remotion/`.

Then create `gtm-loop.journal.md` from `references/journal-template.md` if it does not exist, and generate the DM persona prompt from `references/dm-persona-template.md` filled with the config values.

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

### 4. Capture
One comment-to-DM automation per post, never one for all:
- Trigger: comment containing the keyword, typo tolerant.
- DM signed by the persona: one sentence reacting to the comment, a mini action plan, a promise (call, access, resource).
- Button to `landing_url` with a unique `?ref=` per post (ex: `p3-hookA`).
- Short public reply under the comment, in the persona's tone.
- Tag the contact when they click.

Optional: a DM workflow with an AI node that keeps replying without Claude, using the generated persona prompt.

### 5. Measure
Read back through Zernio: comments per post, DMs sent, clicks per ref, analytics (views, retention). If the landing counts signups per ref, include them.

### 6. Learn and adjust
- Compare the 3 hooks on real data only.
- Write 2 or 3 concrete rules in the journal (hook, pacing, keyword, topic).
- The next batch applies them.

## Journal

One line per post in `gtm-loop.journal.md`: time, account, post, persona, format, hook, keyword, ref, results. Never delete previous lines.

## Hard rules

- No invented numbers. Analysis uses Zernio data only. Test numbers are not traction.
- One publishing account. Verify the account id before each publication.
- Always ask before deleting anything.
- Fictional persona, never a real face, never a real quote attributed to a real person, do not name the real people it parodies.
- No long dashes in public texts.
- Simplest thing that works.
