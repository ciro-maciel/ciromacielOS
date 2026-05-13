import { Composition } from "remotion";
import { SplitScreenComparison } from "./compositions/SplitScreenComparison/SplitScreenComparison";
import {
	splitScreenComparisonSchema,
	splitScreenComparisonDefaults,
} from "./compositions/SplitScreenComparison/schema";
import { TypographicCardSequence } from "./compositions/TypographicCardSequence/TypographicCardSequence";
import {
	typographicCardSequenceSchema,
	typographicCardSequenceDefaults,
} from "./compositions/TypographicCardSequence/schema";
import { LongformCardSequence } from "./compositions/LongformCardSequence/LongformCardSequence";
import {
	longformCardSequenceSchema,
	longformCardSequenceDefaults,
} from "./compositions/LongformCardSequence/schema";

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
			<Composition
				id="TypographicCardSequence"
				component={TypographicCardSequence}
				durationInFrames={58 * 30}
				fps={30}
				width={1080}
				height={1920}
				schema={typographicCardSequenceSchema}
				defaultProps={typographicCardSequenceDefaults}
				calculateMetadata={async ({ props }) => {
					const fps = (props as { fps?: number }).fps ?? 30;
					const duration = (props as { duration?: number }).duration ?? 58;
					return {
						durationInFrames: Math.ceil(duration * fps),
						fps,
					};
				}}
			/>
			<Composition
				id="LongformCardSequence"
				component={LongformCardSequence}
				durationInFrames={870 * 30}
				fps={30}
				width={1920}
				height={1080}
				schema={longformCardSequenceSchema}
				defaultProps={longformCardSequenceDefaults}
				calculateMetadata={async ({ props }) => {
					const fps = (props as { fps?: number }).fps ?? 30;
					const duration = (props as { duration?: number }).duration ?? 870;
					return {
						durationInFrames: Math.ceil(duration * fps),
						fps,
					};
				}}
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
