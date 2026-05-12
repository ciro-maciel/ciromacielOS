import { Composition } from "remotion";
import { SplitScreenComparison } from "./compositions/SplitScreenComparison/SplitScreenComparison";
import {
	splitScreenComparisonSchema,
	splitScreenComparisonDefaults,
} from "./compositions/SplitScreenComparison/schema";

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="SplitScreenComparison"
				component={SplitScreenComparison}
				durationInFrames={75 * 30}
				fps={30}
				width={1920}
				height={1080}
				schema={splitScreenComparisonSchema}
				defaultProps={splitScreenComparisonDefaults}
			/>
			{/*
				Próximos templates (registrar conforme criados):
				- ScreenRecordOverlay
				- TalkingHead
				- NumberReveal
				- DataVizReveal
				- TitleCard
				- CTAFrame
			*/}
		</>
	);
};
