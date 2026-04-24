import { useCurrentFrame, AbsoluteFill } from "remotion";
import { Composition } from "remotion";
import { Intro, PillsSlide, SourcesSlide, AgentsSlide, Outro, totalFrames } from "./IntroOutro";

function VideoTimeline() {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill>
      <Intro />
      <PillsSlide />
      <SourcesSlide />
      <AgentsSlide />
      <Outro />
    </AbsoluteFill>
  );
}

export const RemotionVideo = () => {
  return (
    <Composition
      id="ConsultFlow"
      durationInFrames={totalFrames}
      fps={30}
      width={1920}
      height={1080}
      component={VideoTimeline}
    />
  );
};

export default RemotionVideo;