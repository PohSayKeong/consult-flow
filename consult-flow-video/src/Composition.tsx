import { AbsoluteFill, Sequence, OffthreadVideo, Audio, useCurrentFrame, interpolate } from "remotion";
import { Composition } from "remotion";
import { Intro, PillsSlide, SourcesSlide, AgentsSlide } from "./IntroOutro";
import demoVideo from "./demo.mp4";
import voiceover from "./voiceover.mp3";

const DEMO_START = 300; // 4 slides × 75 frames (2.5s each)
const DEMO_FRAMES = 3313; // 110.433s * 30fps
const FADE = 30; // frames for fade in/out

const DemoScene = () => {
  const f = useCurrentFrame();
  const opacity = interpolate(
    f,
    [0, FADE, DEMO_FRAMES - FADE, DEMO_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill style={{ opacity }}>
      <OffthreadVideo src={demoVideo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

function VideoTimeline() {
  return (
    <AbsoluteFill>
      <Intro />
      <PillsSlide />
      <SourcesSlide />
      <AgentsSlide />
      <Sequence from={DEMO_START} durationInFrames={DEMO_FRAMES}>
        <DemoScene />
      </Sequence>
    </AbsoluteFill>
  );
}

export const RemotionVideo = () => {
  return (
    <Composition
      id="ConsultFlow"
      durationInFrames={DEMO_START + DEMO_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      component={VideoTimeline}
    />
  );
};

export default RemotionVideo;
