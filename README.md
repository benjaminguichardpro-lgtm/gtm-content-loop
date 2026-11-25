# gtm-content-loop

A Claude skill that runs a full social go-to-market loop for any product: research, create 3 short videos with 3 hooks, publish on Instagram, capture leads with comment-to-DM, measure, learn. Built at the swanbase x Zernio Social GTM Agents hackathon (Paris, 2026).

The skill is a generic base. On first run it interviews you (product, audience, persona, keyword, landing page, account) and saves a local `gtm-loop.config.json`. Nothing about your product is hardcoded.

## Requirements

- Claude Code (or any client that loads Claude skills)
- The [Zernio](https://zernio.com) MCP connected (publishing, automations, inbox, analytics)
- Optional, for the video template: Node, Python 3, and a full ffmpeg with ffprobe (`brew install ffmpeg` on macOS)

## Install

```bash
git clone https://github.com/benjaminguichardpro-lgtm/gtm-content-loop.git
mkdir -p ~/.claude/skills && cp -R gtm-content-loop/skills/gtm-content-loop ~/.claude/skills/
```

Then in your project, tell Claude: "setup gtm loop", and later "new batch".

## Contents

- `skills/gtm-content-loop/SKILL.md`: the loop and the setup flow
- `skills/gtm-content-loop/config.example.json`: config schema
- `skills/gtm-content-loop/references/`: DM persona prompt template, journal template
- `skills/gtm-content-loop/templates/video-remotion/`: "incoming call" video template (Remotion, AI voice)

## Before publishing content

- Keep account ids and tokens out of the repo (the config is git-ignored).
- Use fictional personas and never name the real people they parody.
- Do not present test numbers as traction.

## License

MIT
