import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { BrandPalette } from "./BrandPalette";

export type CaptionEntry = {
	fromSec: number;
	toSec: number;
	text: string;
};

type Props = {
	captions: CaptionEntry[];
	brand: BrandPalette;
	fontSize?: number;
	maxWidth?: number;
	bottomOffset?: number;
};

/**
 * Caption burned-in sincronizada com timing dos beats.
 * Renderiza só a caption ativa pro frame atual.
 * Estilo padronizado: bg semi-transparente, alto contraste, fontSize grande pra mobile.
 */
export const BurnedCaption: React.FC<Props> = ({
	captions,
	brand,
	fontSize = 64,
	maxWidth = 1400,
	bottomOffset = 120,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const currentSec = frame / fps;

	const active = captions.find(
		(c) => currentSec >= c.fromSec && currentSec < c.toSec,
	);

	if (!active) {
		return null;
	}

	// Fade in 100ms, fade out 100ms
	const fadeInFrames = 3;
	const fadeOutFrames = 3;
	const localFrame = frame - active.fromSec * fps;
	const captionDurationFrames = (active.toSec - active.fromSec) * fps;

	const opacity = interpolate(
		localFrame,
		[
			0,
			fadeInFrames,
			captionDurationFrames - fadeOutFrames,
			captionDurationFrames,
		],
		[0, 1, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	return (
		<div
			style={{
				position: "absolute",
				bottom: bottomOffset,
				left: "50%",
				transform: "translateX(-50%)",
				maxWidth,
				padding: "32px 48px",
				background: `${brand.bgElevated}E6`, // E6 = ~90% alpha
				borderRadius: 12,
				opacity,
			}}
		>
			<div
				style={{
					fontFamily: brand.fontHeading,
					fontSize,
					fontWeight: 600,
					lineHeight: 1.2,
					color: brand.textPrimary,
					textAlign: "center",
				}}
			>
				{active.text}
			</div>
		</div>
	);
};
