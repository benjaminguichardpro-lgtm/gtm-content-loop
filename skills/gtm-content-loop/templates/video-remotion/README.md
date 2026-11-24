# Remotion "incoming call" template

1. Copy `Call.tsx` and `index.tsx` into `src/` of this folder; put poses and sounds in `public/`.
2. `pip install -r requirements.txt` and `npm install` (gen_voice.py needs a full ffmpeg and ffprobe on PATH: `brew install ffmpeg`; the ffmpeg bundled with Remotion is not enough).
3. Write a script JSON (see `example-script.json`): one segment per scene with pose, bubble text, spoken line.
4. `python3 gen_voice.py script.json script_timed.json` generates the voice and the timing.
5. `python3 make_assets.py <images_dir> public` cuts the pose sheets and generates sounds.
6. `npm run render` outputs a 1080x1920 MP4.

Persona images are not included. Generate three sheets with your image tool and name them so the files match `*Four_Expressions*` (2x2: phone, neutral, talk, skeptic), `*Reaction_Grid*` (4x3: phone_s, neutral_s, talk_s, skeptic_s, one, two, three, crossed, watch, disappointed, point, hangup) and `*Calculating*` (3x2: calc_tap, calc_show, pen, steeple, notepad, stopwatch). Use a fictional character, never a real face. Adjust names in `make_assets.py` if you use other poses.
