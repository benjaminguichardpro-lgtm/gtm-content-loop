import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Call, Script} from './Call';

const defaults: Script = {mentor: 'Your Mentor', hook: 'Hook', ringSec: 2.5, totalSec: 10, segments: [{start: 2.5, end: 9, pose: 'neutral', text: 'Hi'}]};

const Root: React.FC = () => (
  <Composition
    id="Call"
    component={Call as unknown as React.FC<Record<string, unknown>>}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={defaults as unknown as Record<string, unknown>}
    calculateMetadata={({props}) => ({durationInFrames: Math.round(((props as unknown as Script).totalSec) * 30)})}
  />
);
registerRoot(Root);
