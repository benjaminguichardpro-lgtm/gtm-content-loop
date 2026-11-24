import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type Segment = {start: number; end: number; pose: string; text?: string; kind?: 'bubble' | 'cta' | 'big'; say?: string; voice?: string};
export type Script = {
  mentor: string;
  hook: string;
  ringSec: number;
  totalSec: number;
  segments: Segment[];
  stopwatch?: {from: number; to: number; label?: string; fromSegment?: number};
  endText?: string;
};

const FONT = 'Inter, "Helvetica Neue", Arial, sans-serif';

const Hook: React.FC<{text: string; fade: number}> = ({text, fade}) => (
  <div style={{position: 'absolute', top: 330, left: 60, right: 60, opacity: fade, textAlign: 'center'}}>
    <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 78, lineHeight: 1.32, color: '#fff', background: '#111', padding: '10px 22px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', borderRadius: 14}}>{text}</span>
  </div>
);

const Ringing: React.FC<{s: Script}> = ({s}) => {
  const f = useCurrentFrame();
  const pulse = (f % 30) / 30;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1b2a4a,#0b0f1a)'}}>
      <Img src={staticFile('poses/neutral.jpg')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(40px) brightness(0.45)'}} />
      <div style={{position: 'absolute', top: 760, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{position: 'relative', width: 340, height: 340}}>
          <div style={{position: 'absolute', inset: -40 * pulse, borderRadius: '50%', border: '6px solid rgba(255,255,255,' + (1 - pulse) * 0.6 + ')'}} />
          <Img src={staticFile('poses/neutral.jpg')} style={{width: 340, height: 340, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top'}} />
        </div>
        <div style={{fontFamily: FONT, color: '#fff', fontSize: 92, fontWeight: 800, marginTop: 50}}>{s.mentor}</div>
        <div style={{fontFamily: FONT, color: 'rgba(255,255,255,.75)', fontSize: 48, marginTop: 10}}>is calling you…</div>
      </div>
      <div style={{position: 'absolute', bottom: 230, width: '100%', display: 'flex', justifyContent: 'space-around'}}>
        {[['#ff3b30', 'Decline'], ['#34c759', 'Accept']].map(([c, l], i) => (
          <div key={l} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{width: 170, height: 170, borderRadius: '50%', background: c, transform: i === 1 ? `scale(${1 + 0.08 * Math.sin(f / 3)})` : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80}}>📞</div>
            <div style={{fontFamily: FONT, color: '#fff', fontSize: 40, marginTop: 16}}>{l}</div>
          </div>
        ))}
      </div>
      <Hook text={s.hook} fade={interpolate(f, [0, 6], [0, 1], {extrapolateRight: 'clamp'})} />
    </AbsoluteFill>
  );
};

const Bubble: React.FC<{seg: Segment; local: number; dur: number}> = ({seg, dur}) => {
  const local = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame: local, fps, config: {damping: 13, stiffness: 180}});
  const out = interpolate(local, [dur - 4, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cta = seg.kind === 'cta';
  const big = seg.kind === 'big';
  return (
    <div style={{position: 'absolute', left: 60, right: 60, bottom: cta ? 260 : 300, display: 'flex', justifyContent: 'center', opacity: out}}>
      <div style={{transform: `scale(${0.6 + 0.4 * sp}) translateY(${(1 - sp) * 60}px)`, background: cta ? '#FFD400' : '#fff', color: '#0b0b0b', fontFamily: FONT, fontWeight: 800, fontSize: big ? 84 : cta ? 70 : 64, lineHeight: 1.15, padding: '34px 44px', borderRadius: 40, borderBottomLeftRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,.45)', textAlign: 'center', whiteSpace: 'pre-line'}}>
        {seg.text}
      </div>
    </div>
  );
};

const Stopwatch: React.FC<{from: number; label?: string}> = ({from, label}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const secs = f / fps;
  const s = Math.floor(secs);
  const cs = Math.floor((secs - s) * 100);
  return (
    <div style={{position: 'absolute', top: 120, left: 50, background: 'rgba(0,0,0,.78)', borderRadius: 28, padding: '18px 30px', fontFamily: FONT, color: '#FFD400', fontWeight: 900, fontSize: 76, fontVariantNumeric: 'tabular-nums'}}>
      {label ? <div style={{fontSize: 30, color: '#fff', fontWeight: 600}}>{label}</div> : null}
      00:{String(s).padStart(2, '0')}.{String(cs).padStart(2, '0')}
    </div>
  );
};

const InCall: React.FC<{s: Script}> = ({s}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps + s.ringSec;
  const seg = s.segments.find((x) => t >= x.start && t < x.end) ?? s.segments[s.segments.length - 1];
  const segLocal = Math.round((t - seg.start) * fps);
  const punch = interpolate(segLocal, [0, 6], [1.06, 1], {extrapolateRight: 'clamp'});
  const elapsed = Math.floor(f / fps);
  const last = s.segments[s.segments.length - 1];
  const ended = t >= last.end;
  return (
    <AbsoluteFill style={{background: '#0b0f1a'}}>
      <Img src={staticFile(`poses/${seg.pose}.jpg`)} style={{position: 'absolute', top: 0, width: 1080, height: 1440, objectFit: 'cover', transform: `scale(${punch})`}} />
      <div style={{position: 'absolute', top: 1240, width: 1080, height: 680, background: 'linear-gradient(180deg,rgba(11,15,26,0),#0b0f1a 30%)'}} />
      <div style={{position: 'absolute', top: 60, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, color: '#fff', fontSize: 38, fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,.6)'}}>
        {s.mentor} · 00:{String(elapsed).padStart(2, '0')}
      </div>
      <div style={{position: 'absolute', top: 1130, right: 50, width: 200, height: 280, borderRadius: 28, background: 'linear-gradient(180deg,#3a3f4b,#1d2129)', border: '4px solid rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: 'rgba(255,255,255,.7)', fontSize: 34}}>You 😶</div>
      {s.segments.map((x, i) =>
        x.text ? (
          <Sequence key={i} from={Math.round((x.start - s.ringSec) * fps)} durationInFrames={Math.max(1, Math.round((x.end - x.start) * fps))}>
            <Bubble seg={x} local={0} dur={Math.round((x.end - x.start) * fps)} />
          </Sequence>
        ) : null
      )}
      {s.segments.map((x, i) =>
        x.text ? (
          <Sequence key={'a' + i} from={Math.round((x.start - s.ringSec) * fps)} durationInFrames={10}>
            <Audio src={staticFile('sfx/pop.wav')} volume={0.35} />
          </Sequence>
        ) : null
      )}
      {s.segments.map((x, i) =>
        x.voice ? (
          <Sequence key={'v' + i} from={Math.round((x.start - s.ringSec) * fps)}>
            <Audio src={staticFile(x.voice)} />
          </Sequence>
        ) : null
      )}
      {s.stopwatch ? (
        <Sequence from={Math.round((s.stopwatch.from - s.ringSec) * fps)} durationInFrames={Math.round((s.stopwatch.to - s.stopwatch.from) * fps)}>
          <Stopwatch from={s.stopwatch.from} label={s.stopwatch.label} />
        </Sequence>
      ) : null}
      {ended ? (
        <AbsoluteFill style={{background: 'rgba(0,0,0,.75)', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: FONT, color: '#fff', fontSize: 80, fontWeight: 800}}>Call ended</div>
          <div style={{fontFamily: FONT, color: '#FFD400', fontSize: 52, fontWeight: 700, marginTop: 20}}>{s.endText ?? `${s.mentor} will call back.`}</div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export const Call: React.FC<Script> = (s) => {
  const {fps} = useVideoConfig();
  const ringF = Math.round(s.ringSec * fps);
  const last = s.segments[s.segments.length - 1];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence durationInFrames={ringF}>
        <Ringing s={s} />
        <Audio src={staticFile('sfx/ring.wav')} />
      </Sequence>
      <Sequence from={ringF}>
        <InCall s={s} />
      </Sequence>
      <Sequence from={ringF} durationInFrames={12}>
        <Audio src={staticFile('sfx/answer.wav')} />
      </Sequence>
      <Sequence from={Math.round(last.end * fps)} durationInFrames={40}>
        <Audio src={staticFile('sfx/hangup.wav')} />
      </Sequence>
    </AbsoluteFill>
  );
};
