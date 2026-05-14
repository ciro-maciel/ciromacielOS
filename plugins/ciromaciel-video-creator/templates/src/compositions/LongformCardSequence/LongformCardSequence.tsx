import React from "react";
import {
	AbsoluteFill,
	Html5Audio,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Sequence,
} from "remotion";
import { BurnedCaption } from "../../shared/BurnedCaption";
import { FitText } from "../../shared/FitText";
import type {
	LongformCardSequenceProps,
	LongformCard,
	LongformBrand,
} from "./schema";

/**
 * Largura útil pra headlines no frame 16:9 (1920px) — 210px de padding/lado.
 * FitText garante que nenhum texto grande sangre além disso. Margem generosa
 * (zen aesthetic: whitespace é respiro, headline não encosta na borda).
 */
const HEADLINE_MAX_WIDTH = 1920 - 420;

/**
 * LongformCardSequence — versão longform (5-25 min) do TypographicCardSequence.
 *
 * Adições sobre o template type-first base:
 *  - blocks[] / chapters[] visíveis sutilmente quando block muda (marker top-right)
 *  - patternInterrupt cards: bg dark + frase única + opcional silenceTrailSec
 *  - brollSlots[] placeholders cinza com label (editor preenche em pós)
 *  - items[] + leftLabel/rightLabel (compat com youtube-01 escrito em formato Split)
 *
 * Aspect: 16:9 default. Layout responsivo.
 */
export const LongformCardSequence: React.FC<LongformCardSequenceProps> = ({
	cards,
	leftLabel,
	rightLabel,
	items,
	blocks,
	chapters,
	brollSlots,
	brand,
	captions,
	audio,
	defaultBg,
	defaultFg,
	defaultAccent,
	captionsBurned,
	showChapterMarkers,
}) => {
	const { fps } = useVideoConfig();

	// Se nao tem cards mas tem items (compat youtube-01 SplitScreenComparison-style),
	// sintetizar cards a partir dos items pra renderizar como anchor cards
	const effectiveCards: LongformCard[] =
		cards && cards.length > 0
			? cards
			: synthesizeCardsFromItems(items ?? [], leftLabel, rightLabel);

	return (
		<AbsoluteFill style={{ backgroundColor: defaultBg }}>
			{audio.voPath ? (
				<Html5Audio src={staticFile(audio.voPath)} volume={1} />
			) : null}
			{audio.musicPath ? (
				<Html5Audio
					src={staticFile(audio.musicPath)}
					volume={audio.duckMusicUnderVo && audio.voPath ? 0.18 : 0.5}
				/>
			) : null}

			{/* Cards */}
			{effectiveCards.map((card, i) => {
				const timing = resolveTiming(card, fps);
				return (
					<Sequence
						key={card.id ?? `card-${i}`}
						from={timing.fromFrame}
						durationInFrames={timing.durationFrames}
						layout="none"
					>
						<CardRenderer
							card={card}
							brand={brand}
							fallbackBg={defaultBg}
							fallbackFg={defaultFg}
							fallbackAccent={defaultAccent}
							currentBlock={findCurrentBlock(blocks, card)}
							chapter={findCurrentChapter(chapters, card)}
							showChapterMarker={showChapterMarkers}
						/>
					</Sequence>
				);
			})}

			{/* B-roll slots — placeholders sobrepostos no timing definido */}
			{brollSlots.map((slot, i) => {
				const fromFrame = Math.round(slot.fromSec * fps);
				const dur = Math.max(
					1,
					Math.round((slot.toSec - slot.fromSec) * fps),
				);
				return (
					<Sequence
						key={slot.id ?? `broll-${i}`}
						from={fromFrame}
						durationInFrames={dur}
						layout="none"
					>
						<BrollPlaceholder
							label={slot.label}
							hint={slot.hint}
							brand={brand}
						/>
					</Sequence>
				);
			})}

			{/* Captions */}
			{captionsBurned && captions.length > 0 ? (
				<BurnedCaption
					captions={captions}
					brand={brandToCaptionPalette(brand, defaultBg, defaultFg)}
					fontSize={36}
					bottomOffset={80}
				/>
			) : null}
		</AbsoluteFill>
	);
};

// ---------- helpers ----------

function resolveTiming(
	card: LongformCard,
	fps: number,
): { fromFrame: number; durationFrames: number } {
	if (card.fromFrame !== undefined && card.toFrame !== undefined) {
		return {
			fromFrame: card.fromFrame,
			durationFrames: Math.max(1, card.toFrame - card.fromFrame),
		};
	}
	if (card.fromSec !== undefined && card.toSec !== undefined) {
		return {
			fromFrame: Math.round(card.fromSec * fps),
			durationFrames: Math.max(1, Math.round((card.toSec - card.fromSec) * fps)),
		};
	}
	if (card.atSec !== undefined) {
		const dur = card.durationSec ?? 5;
		return {
			fromFrame: Math.round(card.atSec * fps),
			durationFrames: Math.max(1, Math.round(dur * fps)),
		};
	}
	return { fromFrame: 0, durationFrames: fps * 5 };
}

function synthesizeCardsFromItems(
	items: Array<{ label: string; left: string; right: string; atSec: number }>,
	leftLabel: string | undefined,
	rightLabel: string | undefined,
): LongformCard[] {
	if (items.length === 0) return [];
	const cards: LongformCard[] = [];

	// Card 0 — title com leftLabel × rightLabel
	if (leftLabel && rightLabel) {
		cards.push({
			id: "synth-intro",
			fromSec: 0,
			toSec: items[0].atSec,
			layout: "split-binary",
			eyebrow: "+ Schein 1978",
			split: {
				left: leftLabel,
				right: rightLabel,
				separator: "×",
			},
			hairline: true,
		} as LongformCard);
	}

	// Cada item vira um anchor card
	items.forEach((item, i) => {
		const nextAt = items[i + 1]?.atSec ?? items[i].atSec + 30;
		cards.push({
			id: `synth-item-${i}`,
			fromSec: item.atSec,
			toSec: nextAt,
			layout: "anchor",
			number: item.label.split("·")[0]?.trim() ?? `${i + 1}`,
			title: item.label.split("·").slice(1).join("·").trim() || item.label,
			sub: `${leftLabel ?? "declarada"}: ${item.left} — ${rightLabel ?? "obedecida"}: ${item.right}`,
			hairline: true,
		} as LongformCard);
	});

	return cards;
}

function findCurrentBlock(
	blocks: LongformCardSequenceProps["blocks"],
	card: LongformCard,
) {
	if (card.blockId) {
		return blocks.find((b) => b.id === card.blockId);
	}
	const start = card.fromSec ?? 0;
	const matched = [...blocks]
		.filter((b) => b.blockStartSec <= start)
		.sort((a, b) => b.blockStartSec - a.blockStartSec)[0];
	return matched;
}

function findCurrentChapter(
	chapters: LongformCardSequenceProps["chapters"],
	card: LongformCard,
) {
	const start = card.fromSec ?? 0;
	const matched = [...chapters]
		.filter((c) => c.startSec <= start)
		.sort((a, b) => b.startSec - a.startSec)[0];
	return matched;
}

function brandToCaptionPalette(
	brand: LongformBrand,
	fallbackBg: string,
	fallbackFg: string,
) {
	return {
		bgPrimary: brand.bgPrimary ?? fallbackBg,
		bgElevated:
			brand.bgElevated ?? brand.bgInverse ?? brand.bgDark ?? "#1F2937",
		textPrimary: brand.textPrimary ?? brand.textOnDark ?? fallbackFg ?? "#F8F8F8",
		textSecondary: brand.textSecondary ?? brand.textMuted ?? "#9CA3AF",
		accentPrimary: brand.accentPrimary ?? brand.accentGreen ?? "#51CF66",
		accentNegative: brand.accentNegative ?? "#FF5C7A",
		accentLink: brand.accentLink ?? "#5B8DEF",
		border: brand.border ?? brand.borderHairline ?? "#E5E7EB",
		fontHeading: brand.fontHeading ?? "Montserrat",
		fontBody: brand.fontBody ?? "Montserrat",
		fontData: brand.fontData ?? brand.fontMono ?? brand.fontHeading ?? "Montserrat",
	};
}

function isDarkBg(bg: string): boolean {
	if (!bg || !bg.startsWith("#") || bg.length < 7) return false;
	const r = parseInt(bg.slice(1, 3), 16);
	const g = parseInt(bg.slice(3, 5), 16);
	const b = parseInt(bg.slice(5, 7), 16);
	const luma = 0.299 * r + 0.587 * g + 0.114 * b;
	return luma < 128;
}

// ---------- Card renderer ----------

const CardRenderer: React.FC<{
	card: LongformCard;
	brand: LongformBrand;
	fallbackBg: string;
	fallbackFg: string;
	fallbackAccent: string;
	currentBlock?: { blockTitle?: string; title?: string };
	chapter?: { title: string };
	showChapterMarker: boolean;
}> = ({
	card,
	brand,
	fallbackBg,
	fallbackFg,
	fallbackAccent,
	currentBlock,
	chapter,
	showChapterMarker,
}) => {
	const frame = useCurrentFrame();
	const { width, height } = useVideoConfig();

	const landFrames = 12;
	const opacity = interpolate(frame, [0, landFrames], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const scale = interpolate(frame, [0, landFrames], [0.99, 1.0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Pattern interrupt overrides bg to dark unless explicitly set
	const isPatternInterrupt = card.patternInterrupt === true;
	const bg =
		card.bg ??
		card.background ??
		(isPatternInterrupt ? brand.bgDark ?? "#34322D" : fallbackBg);
	const fg =
		card.fg ??
		card.textColor ??
		(isDarkBg(bg)
			? brand.textOnDark ?? "#F8F8F8"
			: brand.textOnLight ?? brand.textPrimary ?? fallbackFg);
	const accent =
		card.accent ??
		card.accentColor ??
		brand.accentPrimary ??
		brand.accentGreen ??
		fallbackAccent;

	const hairlineColor = brand.border ?? brand.borderHairline ?? "#E5E7EB";

	// Padding generoso pra 16:9
	const padding = Math.round(Math.min(width, height) * 0.08);

	const chapterLabel =
		chapter?.title ?? currentBlock?.blockTitle ?? currentBlock?.title;

	if (card.isBrollSlot) {
		return (
			<BrollPlaceholder
				label={card.brollLabel ?? "[ b-roll placeholder ]"}
				brand={brand}
			/>
		);
	}

	return (
		<AbsoluteFill
			style={{
				backgroundColor: bg,
				opacity,
				transform: `scale(${scale})`,
			}}
		>
			{/* Hairline frame */}
			{card.hairline ? (
				<div
					style={{
						position: "absolute",
						top: padding * 0.6,
						left: padding * 0.6,
						right: padding * 0.6,
						bottom: padding * 0.6,
						border: `1px solid ${hairlineColor}`,
						borderRadius: brand.radius ?? 8,
						pointerEvents: "none",
						opacity: isDarkBg(bg) ? 0.15 : 1,
					}}
				/>
			) : null}

			{/* Chapter marker (top-right, sutil) */}
			{showChapterMarker && chapterLabel ? (
				<div
					style={{
						position: "absolute",
						top: padding * 0.6 + 24,
						right: padding * 0.6 + 24,
						fontFamily: brand.fontMono ?? brand.fontData ?? brand.fontHeading ?? "Montserrat",
						fontSize: 16,
						fontWeight: 600,
						letterSpacing: "0.12em",
						textTransform: "uppercase",
						color: isDarkBg(bg)
							? brand.textMuted ?? "#9CA3AF"
							: brand.textMuted ?? "#9CA3AF",
						opacity: 0.55,
					}}
				>
					{chapterLabel}
				</div>
			) : null}

			<div
				style={{
					position: "absolute",
					inset: 0,
					padding,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "stretch",
				}}
			>
				<LayoutRouter
					card={card}
					brand={brand}
					fg={fg}
					accent={accent}
					hairlineColor={hairlineColor}
					emphasizeLanding={isPatternInterrupt}
				/>
			</div>
		</AbsoluteFill>
	);
};

// ---------- B-roll placeholder ----------

const BrollPlaceholder: React.FC<{
	label: string;
	hint?: string;
	brand: LongformBrand;
}> = ({ label, hint, brand }) => {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#1A1A1A",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				padding: 80,
			}}
		>
			<div
				style={{
					border: `1px dashed ${brand.border ?? "#3A3A3A"}`,
					borderRadius: brand.radius ?? 8,
					padding: "80px 120px",
					textAlign: "center",
				}}
			>
				<div
					style={{
						fontFamily: brand.fontMono ?? brand.fontData ?? brand.fontHeading ?? "Montserrat",
						fontSize: 24,
						fontWeight: 600,
						color: "#9CA3AF",
						letterSpacing: "0.12em",
						textTransform: "uppercase",
						marginBottom: 24,
					}}
				>
					B-ROLL SLOT
				</div>
				<div
					style={{
						fontFamily: brand.fontHeading ?? "Montserrat",
						fontSize: 48,
						fontWeight: 600,
						color: "#F8F8F8",
						marginBottom: 16,
					}}
				>
					{label}
				</div>
				{hint ? (
					<div
						style={{
							fontFamily: brand.fontBody ?? "Montserrat",
							fontSize: 20,
							fontWeight: 500,
							color: "#6B7280",
						}}
					>
						{hint}
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

// ---------- Layout router (cópia local — não import circular do TypographicCardSequence) ----------

const LayoutRouter: React.FC<{
	card: LongformCard;
	brand: LongformBrand;
	fg: string;
	accent: string;
	hairlineColor: string;
	emphasizeLanding: boolean;
}> = ({ card, brand, fg, accent, hairlineColor }) => {
	const layout = (card.layout ?? "center").toLowerCase();

	switch (layout) {
		case "hero-number":
		case "centered-display":
		case "two-line-stack":
		case "triple-negation-stack":
		case "center":
		case "synthesis":
			return <HeroLayout card={card} brand={brand} fg={fg} accent={accent} />;
		case "eyebrow-title":
			return (
				<EyebrowTitleLayout
					card={card}
					brand={brand}
					fg={fg}
					accent={accent}
					hairlineColor={hairlineColor}
				/>
			);
		case "headline-sub":
		case "body-text":
			return (
				<HeadlineSubLayout card={card} brand={brand} fg={fg} accent={accent} />
			);
		case "anchor":
			return (
				<AnchorLayout
					card={card}
					brand={brand}
					fg={fg}
					accent={accent}
					hairlineColor={hairlineColor}
				/>
			);
		case "split-binary":
			return (
				<SplitBinaryLayout card={card} brand={brand} fg={fg} accent={accent} />
			);
		case "eyebrow-list":
			return (
				<EyebrowListLayout card={card} brand={brand} fg={fg} accent={accent} />
			);
		case "cta":
			return (
				<CtaLayout
					card={card}
					brand={brand}
					fg={fg}
					accent={accent}
					hairlineColor={hairlineColor}
				/>
			);
		default:
			return <HeroLayout card={card} brand={brand} fg={fg} accent={accent} />;
	}
};

// ---------- atoms (copy of TypographicCardSequence — duplicated p/ evitar circular) ----------

const AccentText: React.FC<{
	text: string;
	accentWord?: string;
	accentColor?: string;
	color: string;
}> = ({ text, accentWord, accentColor, color }) => {
	if (!accentWord || !text.includes(accentWord)) {
		return <span style={{ color }}>{text}</span>;
	}
	const parts = text.split(accentWord);
	return (
		<span style={{ color }}>
			{parts.map((part, i) => (
				<React.Fragment key={i}>
					{part}
					{i < parts.length - 1 ? (
						<span style={{ color: accentColor ?? color }}>{accentWord}</span>
					) : null}
				</React.Fragment>
			))}
		</span>
	);
};

function getText(field: LongformCard["headline"] | LongformCard["sub"]): string | null {
	if (!field) return null;
	if (typeof field === "string") return field;
	return field.text;
}

function getTextObj(field: LongformCard["headline"] | LongformCard["sub"]) {
	if (!field) return null;
	if (typeof field === "string") return { text: field };
	return field;
}

const HeroLayout: React.FC<{
	card: LongformCard;
	brand: LongformBrand;
	fg: string;
	accent: string;
}> = ({ card, brand, fg, accent }) => {
	const font = brand.fontHeading ?? "Montserrat";
	const tracking = brand.trackingHero ?? "-0.05em";

	if (card.lines && card.lines.length > 0) {
		return (
			<div style={center()}>
				{card.lines.map((line, i) => (
					<FitText
						key={i}
						maxFontSize={line.sizePx ?? 110}
						maxWidth={HEADLINE_MAX_WIDTH}
						fontFamily={font}
						fontWeight={line.weight ?? 950}
						letterSpacing={line.tracking ?? tracking}
						lineHeight={0.95}
						textAlign="center"
						color={line.color ?? fg}
						style={{
							marginBottom: i < card.lines!.length - 1 ? 16 : 0,
						}}
					>
						<AccentText
							text={line.text}
							accentWord={line.accentWord}
							accentColor={line.accentColor ?? accent}
							color={line.color ?? fg}
						/>
					</FitText>
				))}
			</div>
		);
	}

	if (card.headlineLines && card.headlineLines.length > 0) {
		const accentTokens: string[] = card.headlineAccentTokens ?? [];
		const singleToken = card.headlineAccentToken;
		return (
			<div style={center()}>
				{card.headlineLines.map((text, i) => {
					const accentWord =
						accentTokens[i] ?? (i === 0 ? singleToken : undefined);
					return (
						<FitText
							key={i}
							maxFontSize={160}
							maxWidth={HEADLINE_MAX_WIDTH}
							fontFamily={font}
							fontWeight={950}
							letterSpacing={tracking}
							lineHeight={0.95}
							textAlign="center"
							color={fg}
							style={{
								marginBottom: i < card.headlineLines!.length - 1 ? 16 : 0,
							}}
						>
							<AccentText
								text={text}
								accentWord={accentWord}
								accentColor={accent}
								color={fg}
							/>
						</FitText>
					);
				})}
				{card.sub ? <SubBlock sub={card.sub} brand={brand} /> : null}
			</div>
		);
	}

	const obj = getTextObj(card.headline);
	if (obj) {
		return (
			<div style={center()}>
				<FitText
					maxFontSize={obj.sizePx ?? 120}
					maxWidth={HEADLINE_MAX_WIDTH}
					fontFamily={obj.font ?? font}
					fontWeight={obj.weight ?? 950}
					letterSpacing={obj.tracking ?? tracking}
					lineHeight={0.95}
					textAlign="center"
					color={obj.color ?? fg}
				>
					<AccentText
						text={obj.text}
						accentWord={obj.accentWord}
						accentColor={obj.accentColor ?? accent}
						color={obj.color ?? fg}
					/>
				</FitText>
				{card.sub ? <SubBlock sub={card.sub} brand={brand} /> : null}
			</div>
		);
	}

	if (card.title) {
		return (
			<div style={center()}>
				<FitText
					text={card.title}
					maxFontSize={card.titleSize ?? 120}
					maxWidth={HEADLINE_MAX_WIDTH}
					fontFamily={font}
					fontWeight={card.titleWeight ?? 950}
					letterSpacing={tracking}
					lineHeight={0.95}
					textAlign="center"
					color={card.titleColor ?? fg}
				/>
				{card.sub ? <SubBlock sub={card.sub} brand={brand} /> : null}
			</div>
		);
	}

	return null;
};

const EyebrowTitleLayout: React.FC<{
	card: LongformCard;
	brand: LongformBrand;
	fg: string;
	accent: string;
	hairlineColor: string;
}> = ({ card, brand, fg, accent, hairlineColor }) => {
	const font = brand.fontHeading ?? "Montserrat";
	const tracking = brand.trackingDisplay ?? "-0.04em";

	return (
		<div style={center()}>
			{card.eyebrow ? (
				<EyebrowBlock
					text={card.eyebrow}
					style={card.eyebrowStyle}
					brand={brand}
					color={brand.textMuted ?? "#9CA3AF"}
					hairlineColor={hairlineColor}
				/>
			) : null}
			{(card.headlineLines ?? []).map((text, i) => (
				<FitText
					key={i}
					text={text}
					maxFontSize={140}
					maxWidth={HEADLINE_MAX_WIDTH}
					fontFamily={font}
					fontWeight={950}
					letterSpacing={tracking}
					lineHeight={0.95}
					textAlign="center"
					color={fg}
					style={{
						marginBottom: i < (card.headlineLines ?? []).length - 1 ? 12 : 0,
					}}
				/>
			))}
			{!card.headlineLines && getTextObj(card.headline) ? (
				<HeadlineBlock
					headline={card.headline!}
					fg={fg}
					accent={accent}
					brand={brand}
				/>
			) : null}
			{card.sub ? <SubBlock sub={card.sub} brand={brand} /> : null}
		</div>
	);
};

const HeadlineSubLayout: React.FC<{
	card: LongformCard;
	brand: LongformBrand;
	fg: string;
	accent: string;
}> = ({ card, brand, fg, accent }) => {
	return (
		<div style={center()}>
			{card.eyebrow ? (
				<EyebrowBlock
					text={card.eyebrow}
					style={card.eyebrowStyle}
					brand={brand}
					color={brand.textMuted ?? "#9CA3AF"}
					hairlineColor={brand.border ?? "#E5E7EB"}
				/>
			) : null}
			{card.headline ? (
				<HeadlineBlock
					headline={card.headline}
					fg={fg}
					accent={accent}
					brand={brand}
				/>
			) : null}
			{card.sub ? <SubBlock sub={card.sub} brand={brand} /> : null}
			{card.body ? <SubBlock sub={card.body} brand={brand} /> : null}
		</div>
	);
};

const AnchorLayout: React.FC<{
	card: LongformCard;
	brand: LongformBrand;
	fg: string;
	accent: string;
	hairlineColor: string;
}> = ({ card, brand, fg, accent, hairlineColor }) => {
	const font = brand.fontHeading ?? "Montserrat";
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "flex-start",
				paddingLeft: 120,
				paddingRight: 120,
			}}
		>
			{card.number ? (
				<div
					style={{
						fontFamily: brand.fontMono ?? brand.fontData ?? brand.fontHeading ?? "Montserrat",
						fontWeight: 700,
						fontSize: 64,
						color: accent,
						letterSpacing: "0.02em",
						marginBottom: 24,
					}}
				>
					{card.number}
				</div>
			) : null}
			<div
				style={{
					width: 80,
					height: 1,
					background: hairlineColor,
					marginBottom: 32,
				}}
			/>
			{card.title ? (
				<FitText
					text={card.title}
					maxFontSize={140}
					maxWidth={1920 - 240}
					fontFamily={font}
					fontWeight={950}
					letterSpacing={brand.trackingDisplay ?? "-0.04em"}
					lineHeight={0.95}
					textAlign="left"
					color={fg}
					style={{ marginBottom: 32 }}
				/>
			) : null}
			{card.sub ? (
				<div
					style={{
						fontFamily: brand.fontBody ?? font,
						fontWeight: 500,
						fontSize: 40,
						color: brand.textMuted ?? "#9CA3AF",
						lineHeight: 1.25,
						maxWidth: "85%",
					}}
				>
					{getText(card.sub)}
				</div>
			) : null}
		</div>
	);
};

const SplitBinaryLayout: React.FC<{
	card: LongformCard;
	brand: LongformBrand;
	fg: string;
	accent: string;
}> = ({ card, brand, fg, accent }) => {
	const font = brand.fontHeading ?? "Montserrat";
	const split = card.split;
	if (!split) return null;
	const separator = split.separator ?? "×";
	const separatorColor = split.separatorColor ?? accent;

	return (
		<div style={center()}>
			{card.eyebrow ? (
				<EyebrowBlock
					text={card.eyebrow}
					brand={brand}
					color={brand.textMuted ?? "#9CA3AF"}
					hairlineColor={brand.border ?? "#E5E7EB"}
				/>
			) : null}
			<FitText
				maxFontSize={split.sizePx ?? 140}
				maxWidth={HEADLINE_MAX_WIDTH}
				fontFamily={font}
				fontWeight={split.weight ?? 950}
				letterSpacing={split.tracking ?? "-0.04em"}
				lineHeight={0.95}
				textAlign="center"
				color={fg}
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: 64,
				}}
			>
				<span>{split.left}</span>
				<span style={{ color: separatorColor }}>{separator}</span>
				<span>{split.right}</span>
			</FitText>
		</div>
	);
};

const EyebrowListLayout: React.FC<{
	card: LongformCard;
	brand: LongformBrand;
	fg: string;
	accent: string;
}> = ({ card, brand, fg, accent }) => {
	const font = brand.fontHeading ?? "Montserrat";
	const items = card.list ?? card.lines ?? [];
	return (
		<div style={center()}>
			{card.eyebrow ? (
				<EyebrowBlock
					text={card.eyebrow}
					style={card.eyebrowStyle}
					brand={brand}
					color={brand.textMuted ?? "#9CA3AF"}
					hairlineColor={brand.border ?? "#E5E7EB"}
				/>
			) : null}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 24,
				}}
			>
				{items.map((item, i) => (
					<div
						key={i}
						style={{
							fontFamily: font,
							fontWeight: item.weight ?? 600,
							fontSize: item.sizePx ?? 60,
							letterSpacing: item.tracking ?? "-0.02em",
							color: item.color ?? fg,
							textAlign: "center",
							lineHeight: 1.1,
						}}
					>
						<AccentText
							text={item.text}
							accentWord={item.accentWord}
							accentColor={item.accentColor ?? accent}
							color={item.color ?? fg}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

const CtaLayout: React.FC<{
	card: LongformCard;
	brand: LongformBrand;
	fg: string;
	accent: string;
	hairlineColor: string;
}> = ({ card, brand, fg, accent, hairlineColor }) => {
	const font = brand.fontHeading ?? "Montserrat";
	const monoFont = brand.fontMono ?? brand.fontData ?? brand.fontHeading ?? "Montserrat";

	const urlText =
		typeof card.url === "string" ? card.url : card.url?.text ?? null;
	const urlObj = typeof card.url === "object" ? card.url : undefined;

	return (
		<div style={center()}>
			{(card.headlineLines ?? []).map((text, i) => (
				<FitText
					key={i}
					text={text}
					maxFontSize={180}
					maxWidth={HEADLINE_MAX_WIDTH}
					fontFamily={font}
					fontWeight={950}
					letterSpacing={brand.trackingHero ?? "-0.05em"}
					lineHeight={0.95}
					textAlign="center"
					color={fg}
					style={{ marginBottom: 8 }}
				/>
			))}
			{!card.headlineLines && card.headline ? (
				<HeadlineBlock
					headline={card.headline}
					fg={fg}
					accent={accent}
					brand={brand}
				/>
			) : null}
			{urlText ? (
				<>
					<div
						style={{
							width: 80,
							height: 1,
							background: hairlineColor,
							margin: "48px auto",
							opacity: 0.5,
						}}
					/>
					<div
						style={{
							fontFamily: urlObj?.font ?? card.urlFont ?? monoFont,
							fontWeight: urlObj?.weight ?? card.urlWeight ?? 700,
							fontSize: urlObj?.sizePx ?? card.urlSize ?? 40,
							color: urlObj?.color ?? accent,
							textAlign: "center",
							letterSpacing: "0.02em",
						}}
					>
						{urlText}
					</div>
				</>
			) : null}
		</div>
	);
};

const HeadlineBlock: React.FC<{
	headline: NonNullable<LongformCard["headline"]>;
	fg: string;
	accent: string;
	brand: LongformBrand;
}> = ({ headline, fg, accent, brand }) => {
	const obj = getTextObj(headline);
	if (!obj) return null;
	const font = brand.fontHeading ?? "Montserrat";
	return (
		<FitText
			maxFontSize={obj.sizePx ?? 140}
			maxWidth={HEADLINE_MAX_WIDTH}
			fontFamily={obj.font ?? font}
			fontWeight={obj.weight ?? 950}
			letterSpacing={obj.tracking ?? brand.trackingDisplay ?? "-0.04em"}
			lineHeight={0.95}
			textAlign="center"
			color={obj.color ?? fg}
			style={{ marginBottom: 32 }}
		>
			<AccentText
				text={obj.text}
				accentWord={obj.accentWord}
				accentColor={obj.accentColor ?? accent}
				color={obj.color ?? fg}
			/>
		</FitText>
	);
};

const SubBlock: React.FC<{
	sub: NonNullable<LongformCard["sub"]>;
	brand: LongformBrand;
}> = ({ sub, brand }) => {
	const obj = getTextObj(sub);
	if (!obj) return null;
	return (
		<div
			style={{
				marginTop: 32,
				fontFamily: obj.font ?? brand.fontBody ?? "Montserrat",
				fontWeight: obj.weight ?? 500,
				fontSize: obj.sizePx ?? 44,
				color: obj.color ?? brand.textMuted ?? "#9CA3AF",
				textAlign: "center",
				lineHeight: 1.3,
				maxWidth: "80%",
				marginLeft: "auto",
				marginRight: "auto",
			}}
		>
			{obj.text}
		</div>
	);
};

const EyebrowBlock: React.FC<{
	text: string;
	style?: LongformCard["eyebrowStyle"];
	brand: LongformBrand;
	color: string;
	hairlineColor: string;
}> = ({ text, style, brand, color, hairlineColor }) => {
	return (
		<>
			<div
				style={{
					fontFamily: brand.fontHeading ?? "Montserrat",
					fontWeight: style?.weight ?? 800,
					fontSize: style?.sizePx ?? 32,
					letterSpacing: style?.tracking ?? brand.trackingEyebrow ?? "0.12em",
					textTransform: style?.uppercase === false ? "none" : "uppercase",
					color: style?.color ?? color,
					textAlign: "center",
					marginBottom: 32,
				}}
			>
				{text}
			</div>
			<div
				style={{
					width: 64,
					height: 1,
					background: hairlineColor,
					margin: "0 auto 40px",
					opacity: 0.5,
				}}
			/>
		</>
	);
};

function center(): React.CSSProperties {
	return {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	};
}
