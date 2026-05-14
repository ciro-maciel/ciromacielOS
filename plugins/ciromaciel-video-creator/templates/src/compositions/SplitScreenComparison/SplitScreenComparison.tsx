import React from "react";
import {
	AbsoluteFill,
	Html5Audio,
	Img,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	spring,
} from "remotion";
import { BurnedCaption } from "../../shared/BurnedCaption";
import { FitText } from "../../shared/FitText";
import type { SplitScreenComparisonProps } from "./schema";

// Layout geometry — kept in sync with the inline styles below. FitText needs
// an explicit px maxWidth, so we derive each text slot's available width from
// the video width instead of relying on % / flex (which FitText can't measure).
const DIVIDER_WIDTH = 4;
const PANE_PADDING = 64; // SplitPane padding, both sides
const GRID_PADDING_X = 96; // bottom items area, both sides
const GRID_GAP = 24;
const GRID_FR = [1.2, 1, 1] as const; // ItemsGrid gridTemplateColumns

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

	// Usable text width per pane (flex:1 split, minus divider, minus padding).
	const paneWidth = (width - DIVIDER_WIDTH) / 2;
	const paneTextWidth = paneWidth - PANE_PADDING * 2;

	// ItemsGrid column widths — must mirror gridTemplateColumns + gap below.
	const gridInnerWidth = width - GRID_PADDING_X * 2;
	const frTotal = GRID_FR[0] + GRID_FR[1] + GRID_FR[2];
	const frUnit = (gridInnerWidth - GRID_GAP * 2) / frTotal;
	const colWidths = GRID_FR.map((fr) => fr * frUnit) as [
		number,
		number,
		number,
	];

	return (
		<AbsoluteFill style={{ backgroundColor: brand.bgPrimary }}>
			{/* Áudio (VO + música opcional) — Html5Audio é o nome novo no Remotion v4; Audio export deprecated mas funcional */}
			{audio.voPath ? (
				<Html5Audio src={staticFile(audio.voPath)} volume={1} />
			) : null}
			{audio.musicPath ? (
				<Html5Audio
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
					textWidth={paneTextWidth}
				/>
				<Divider brand={brand} />
				<SplitPane
					label={rightLabel}
					screenshot={rightScreenshot}
					brand={brand}
					side="right"
					textWidth={paneTextWidth}
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
					colWidths={colWidths}
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
	textWidth: number;
}> = ({ label, screenshot, brand, side, textWidth }) => {
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
			<FitText
				text={label}
				maxFontSize={48}
				maxWidth={textWidth}
				fontFamily={brand.fontHeading}
				fontWeight={700}
				color={side === "right" ? brand.accentPrimary : brand.textSecondary}
				lineHeight={1}
				style={{ marginBottom: 32 }}
			/>
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
	colWidths: [number, number, number];
}> = ({ items, leftLabel, rightLabel, brand, fps, frame, colWidths }) => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `${GRID_FR[0]}fr ${GRID_FR[1]}fr ${GRID_FR[2]}fr`,
				gap: GRID_GAP,
				alignItems: "center",
			}}
		>
			{/* Header row */}
			<div />
			<HeaderCell label={leftLabel} brand={brand} maxWidth={colWidths[1]} muted />
			<HeaderCell
				label={rightLabel}
				brand={brand}
				maxWidth={colWidths[2]}
				accent
			/>

			{/* Items */}
			{items.map((item, i) => (
				<ItemRow
					key={`${item.label}-${i}`}
					item={item}
					brand={brand}
					fps={fps}
					frame={frame}
					colWidths={colWidths}
				/>
			))}
		</div>
	);
};

const HeaderCell: React.FC<{
	label: string;
	brand: SplitScreenComparisonProps["brand"];
	maxWidth: number;
	muted?: boolean;
	accent?: boolean;
}> = ({ label, brand, maxWidth, muted, accent }) => {
	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<FitText
				text={label}
				maxFontSize={28}
				maxWidth={maxWidth}
				fontFamily={brand.fontHeading}
				fontWeight={600}
				color={
					accent
						? brand.accentPrimary
						: muted
							? brand.textSecondary
							: brand.textPrimary
				}
				lineHeight={1}
			/>
		</div>
	);
};

const ItemRow: React.FC<{
	item: SplitScreenComparisonProps["items"][0];
	brand: SplitScreenComparisonProps["brand"];
	fps: number;
	frame: number;
	colWidths: [number, number, number];
}> = ({ item, brand, fps, frame, colWidths }) => {
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
			<div style={{ display: "flex", justifyContent: "flex-start" }}>
				<FitText
					text={item.label}
					maxFontSize={22}
					maxWidth={colWidths[0]}
					fontFamily={brand.fontBody}
					fontWeight={500}
					color={brand.textSecondary}
					lineHeight={1}
					textAlign="left"
				/>
			</div>
			<div style={{ display: "flex", justifyContent: "center" }}>
				<FitText
					text={item.left}
					maxFontSize={28}
					maxWidth={colWidths[1]}
					fontFamily={brand.fontData}
					fontWeight={500}
					color={brand.textPrimary}
					lineHeight={1}
					style={{ fontVariantNumeric: "tabular-nums" }}
				/>
			</div>
			<div style={{ display: "flex", justifyContent: "center" }}>
				<FitText
					text={item.right}
					maxFontSize={28}
					maxWidth={colWidths[2]}
					fontFamily={brand.fontData}
					fontWeight={500}
					color={brand.accentPrimary}
					lineHeight={1}
					style={{ fontVariantNumeric: "tabular-nums" }}
				/>
			</div>
		</div>
	);
};
