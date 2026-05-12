import React from "react";
import {
	AbsoluteFill,
	Audio,
	Img,
	Sequence,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	spring,
} from "remotion";
import { BurnedCaption } from "../../shared/BurnedCaption";
import type { SplitScreenComparisonProps } from "./schema";

/**
 * SplitScreenComparison — comparação visual lado-a-lado.
 *
 * Layout:
 * - Top 70%: split-screen com label + screenshot de cada lado, divider central
 * - Bottom 30%: items de comparação aparecem sequencialmente (atSec)
 * - Caption burned-in sincronizada com VO
 *
 * Use pra: "Mosaic vs FinFlow", "Excel vs FinFlow", "Old way vs new way", etc.
 */
export const SplitScreenComparison: React.FC<SplitScreenComparisonProps> = ({
	leftLabel,
	rightLabel,
	leftScreenshot,
	rightScreenshot,
	items,
	brand,
	captions,
	audio,
}) => {
	const { fps, width, height } = useVideoConfig();
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill style={{ backgroundColor: brand.bgPrimary }}>
			{/* Áudio (VO + música opcional) */}
			{audio.voPath ? (
				<Audio src={staticFile(audio.voPath)} volume={1} />
			) : null}
			{audio.musicPath ? (
				<Audio
					src={staticFile(audio.musicPath)}
					volume={audio.duckMusicUnderVo && audio.voPath ? 0.18 : 0.5}
				/>
			) : null}

			{/* Top 70% — split screen */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width,
					height: height * 0.7,
					display: "flex",
					flexDirection: "row",
				}}
			>
				<SplitPane
					label={leftLabel}
					screenshot={leftScreenshot}
					brand={brand}
					side="left"
				/>
				<Divider brand={brand} />
				<SplitPane
					label={rightLabel}
					screenshot={rightScreenshot}
					brand={brand}
					side="right"
				/>
			</div>

			{/* Bottom 30% — comparison items */}
			<div
				style={{
					position: "absolute",
					top: height * 0.7,
					left: 0,
					width,
					height: height * 0.3,
					padding: "48px 96px",
					background: brand.bgElevated,
				}}
			>
				<ItemsGrid
					items={items}
					leftLabel={leftLabel}
					rightLabel={rightLabel}
					brand={brand}
					fps={fps}
					frame={frame}
				/>
			</div>

			{/* Caption burned-in (sobreposto) */}
			<BurnedCaption
				captions={captions}
				brand={brand}
				bottomOffset={height * 0.3 + 60}
			/>
		</AbsoluteFill>
	);
};

const SplitPane: React.FC<{
	label: string;
	screenshot: string | null;
	brand: SplitScreenComparisonProps["brand"];
	side: "left" | "right";
}> = ({ label, screenshot, brand, side }) => {
	return (
		<div
			style={{
				flex: 1,
				position: "relative",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				padding: 64,
				background:
					side === "right"
						? `linear-gradient(135deg, ${brand.bgPrimary} 0%, ${brand.bgElevated} 100%)`
						: brand.bgPrimary,
			}}
		>
			<div
				style={{
					fontFamily: brand.fontHeading,
					fontSize: 48,
					fontWeight: 700,
					color: side === "right" ? brand.accentPrimary : brand.textSecondary,
					marginBottom: 32,
				}}
			>
				{label}
			</div>
			{screenshot ? (
				<Img
					src={staticFile(screenshot)}
					style={{
						maxWidth: "85%",
						maxHeight: "75%",
						objectFit: "contain",
						borderRadius: 12,
						boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
					}}
				/>
			) : (
				<div
					style={{
						width: "85%",
						height: "75%",
						background: brand.border,
						borderRadius: 12,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						fontFamily: brand.fontBody,
						fontSize: 24,
						color: brand.textSecondary,
					}}
				>
					[ screenshot pending ]
				</div>
			)}
		</div>
	);
};

const Divider: React.FC<{
	brand: SplitScreenComparisonProps["brand"];
}> = ({ brand }) => {
	return (
		<div
			style={{
				width: 4,
				background: brand.border,
				margin: "48px 0",
			}}
		/>
	);
};

const ItemsGrid: React.FC<{
	items: SplitScreenComparisonProps["items"];
	leftLabel: string;
	rightLabel: string;
	brand: SplitScreenComparisonProps["brand"];
	fps: number;
	frame: number;
}> = ({ items, leftLabel, rightLabel, brand, fps, frame }) => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1.2fr 1fr 1fr",
				gap: 24,
				alignItems: "center",
			}}
		>
			{/* Header row */}
			<div />
			<HeaderCell label={leftLabel} brand={brand} muted />
			<HeaderCell label={rightLabel} brand={brand} accent />

			{/* Items */}
			{items.map((item, i) => (
				<ItemRow
					key={`${item.label}-${i}`}
					item={item}
					brand={brand}
					fps={fps}
					frame={frame}
				/>
			))}
		</div>
	);
};

const HeaderCell: React.FC<{
	label: string;
	brand: SplitScreenComparisonProps["brand"];
	muted?: boolean;
	accent?: boolean;
}> = ({ label, brand, muted, accent }) => {
	return (
		<div
			style={{
				fontFamily: brand.fontHeading,
				fontSize: 28,
				fontWeight: 600,
				color: accent
					? brand.accentPrimary
					: muted
						? brand.textSecondary
						: brand.textPrimary,
				textAlign: "center",
			}}
		>
			{label}
		</div>
	);
};

const ItemRow: React.FC<{
	item: SplitScreenComparisonProps["items"][0];
	brand: SplitScreenComparisonProps["brand"];
	fps: number;
	frame: number;
}> = ({ item, brand, fps, frame }) => {
	const appearFrame = item.atSec * fps;
	const isVisible = frame >= appearFrame;

	const enterProgress = spring({
		frame: frame - appearFrame,
		fps,
		config: { damping: 18, stiffness: 90 },
	});

	const opacity = isVisible ? interpolate(enterProgress, [0, 1], [0, 1]) : 0;
	const translateY = isVisible ? interpolate(enterProgress, [0, 1], [16, 0]) : 16;

	const rowStyle: React.CSSProperties = {
		opacity,
		transform: `translateY(${translateY}px)`,
		display: "contents",
	};

	return (
		<div style={rowStyle}>
			<div
				style={{
					fontFamily: brand.fontBody,
					fontSize: 22,
					fontWeight: 500,
					color: brand.textSecondary,
				}}
			>
				{item.label}
			</div>
			<div
				style={{
					fontFamily: brand.fontData,
					fontSize: 28,
					fontWeight: 500,
					color: brand.textPrimary,
					textAlign: "center",
					fontVariantNumeric: "tabular-nums",
				}}
			>
				{item.left}
			</div>
			<div
				style={{
					fontFamily: brand.fontData,
					fontSize: 28,
					fontWeight: 500,
					color: brand.accentPrimary,
					textAlign: "center",
					fontVariantNumeric: "tabular-nums",
				}}
			>
				{item.right}
			</div>
		</div>
	);
};
