# Usage: python3 gen_voice.py <script.json> <script_timed.json>
# For each segment with a "say" field: generates the voice (edge-tts), measures its
# duration and recomputes start/end so each scene lasts as long as its line.
# Requirements: pip install edge-tts, and a FULL ffmpeg + ffprobe on PATH
# (Remotion's bundled ffmpeg lacks the silenceremove filter and does not work here).
import asyncio, os, sys, json, subprocess, shutil, edge_tts

for tool in ("ffmpeg", "ffprobe"):
    if not shutil.which(tool):
        raise SystemExit(f"{tool} not found. Install a full ffmpeg (macOS: brew install ffmpeg).")
if "silenceremove" not in subprocess.run(["ffmpeg", "-hide_banner", "-filters"], capture_output=True, text=True).stdout:
    raise SystemExit("This ffmpeg build lacks the silenceremove filter. Install a full ffmpeg.")

VOICE, RATE, PITCH = "en-US-ChristopherNeural", "+14%", "-4Hz"
src, dst = sys.argv[1], sys.argv[2]
s = json.load(open(src))
name = os.path.splitext(os.path.basename(src))[0]
os.makedirs(f"public/voice/{name}", exist_ok=True)


async def tts(i, text):
    out = f"public/voice/{name}/{i}.mp3"
    for _ in range(3):
        try:
            await edge_tts.Communicate(text, s.get("voice", VOICE), rate=RATE, pitch=PITCH).save(out)
            if os.path.getsize(out) > 0:
                tmp = out + ".raw.mp3"
                os.replace(out, tmp)
                # trim silence at the start and end
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-af",
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                    out], check=True)
                os.remove(tmp)
                return
        except Exception:
            await asyncio.sleep(1)
    raise SystemExit(f"TTS failed on segment {i}")


async def main():
    await asyncio.gather(*[tts(i, g["say"]) for i, g in enumerate(s["segments"]) if g.get("say")])

asyncio.run(main())


def dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode())


t = s["ringSec"]
for i, g in enumerate(s["segments"]):
    if g.get("say"):
        g["voice"] = f"voice/{name}/{i}.mp3"
        d = dur(f"public/{g['voice']}") + g.get("gap", 0.08)
    else:
        d = g.get("hold", g["end"] - g["start"] if "end" in g else 1.0)
    g["start"], g["end"] = round(t, 2), round(t + d, 2)
    t += d
s["totalSec"] = round(t + 1.0, 2)
if s.get("stopwatch"):
    idx = s["stopwatch"].get("fromSegment")
    if idx is not None:
        s["stopwatch"]["from"] = s["segments"][idx]["start"]
        s["stopwatch"]["to"] = s["segments"][-1]["start"]
json.dump(s, open(dst, "w"), indent=1)
print(f"{name}: {s['totalSec']} s")
