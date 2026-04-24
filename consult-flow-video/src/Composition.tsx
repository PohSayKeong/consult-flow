import { useCurrentFrame, AbsoluteFill } from "remotion";
import { Composition } from "remotion";
import {
  Scene1_Hook,
  Scene2_Problem,
  Scene3_SolutionIntro,
  Scene4_SourceIngestion,
  Scene5_Kanban,
  Scene6_Summary,
  Scene7_AutoActions,
  Scene8_Closing,
  totalFrames,
} from "./Scenes";

function VideoTimeline() {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill>
      {frame >= 0 && frame < 300 && <Scene1_Hook />}
      {frame >= 300 && frame < 750 && <Scene2_Problem />}
      {frame >= 750 && frame < 1200 && <Scene3_SolutionIntro />}
      {frame >= 1200 && frame < 1650 && <Scene4_SourceIngestion />}
      {frame >= 1650 && frame < 2250 && <Scene5_Kanban />}
      {frame >= 2250 && frame < 2850 && <Scene6_Summary />}
      {frame >= 2850 && frame < 3300 && <Scene7_AutoActions />}
      {frame >= 3300 && frame < 3600 && <Scene8_Closing />}
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