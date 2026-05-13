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
import type {
	TypographicCardSequenceProps,
	TypographicCard,
	TypographicBrand,
} from "./schema";

/**
 * TypographicCardSequence — sequência linear de N cards tipográficos.
 *
 * Filosofia: type-first, corte seco, sem motion graphics. Cada card "lands" via
 * micro-scale 0.98→1.0 + opacity 0→1 nos primeiros 8-12 frames.
 *
 * Cobre os shorts: 01, 02, 03, 04, 06 da Campanha 1 de careerthesis.
 *
 * Layout responsivo via useVideoConfig().width/height — default 9:16 mas aceita 16:9.
 */
export const TypographicCardSequence: React.FC<
	TypographicCardSequenceProps
> = ({
	cards,
	brand,
	captions,
	audio,
	defaultBg,
	defaultFg,
	defaultAccent,
	captionsBurned,
}) => {
	const { fps } = useVideoConfig();

	return (
		<AbsoluteFill style={{ backgroundColor: defaultBg }}>
			{/* Audio (VO + música opcional) */}
			{audio.voPath ? (
				<Html5Audio src={staticFile(audio.voPath)} volume={1} />
			) : null}
			{audio.musicPath ? (
				<Html5Audio
					src={staticFile(audio.musicPath)}
					volume={audio.duckMusicUnderVo && audio.voPath ? 0.18 : 0.5}
				/>
			) : null}

			{/* Cards renderizados como Sequences (corte seco) */}
			{cards.map((card, i) => {
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
						/>
					</Sequence>
				);
			})}

			{/* Captions burned-in (overlay) */}
			{captionsBurned && captions.length > 0 ? (
				<BurnedCaption
					captions={captions}
					brand={brandToCaptionPalette(brand, defaultBg, defaultFg)}
					fontSize={48}
					bottomOffset={120}
				/>
			) : null}
		</AbsoluteFill>
	);
};

// ---------- helpers ----------

function resolveTiming(
	card: TypographicCard,
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
		const dur = card.durationSec ?? 3;
		return {
			fromFrame: Math.round(card.atSec * fps),
			durationFrames: Math.max(1, Math.round(dur * fps)),
		};
	}
	return { fromFrame: 0, durationFrames: fps * 3 };
}

function brandToCaptionPalette(
	brand: TypographicBrand,
	fallbackBg: string,
	fallbackFg: string,
) {
	// BurnedCaption espera BrandPalette com bgElevated/textPrimary/fontHeading.
	return {
		bgPrimary: brand.bgPrimary ?? fallbackBg,
		bgElevated:
			brand.bgElevated ??
			brand.bgInverse ??
			brand.bgDark ??
			"#1F2937",
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

// ---------- Card renderer ----------

const CardRenderer: React.FC<{
	card: TypographicCard;
	brand: TypographicBrand;
	fallbackBg: string;
	fallbackFg: string;
	fallbackAccent: string;
}> = ({ card, brand, fallbackBg, fallbackFg, fallbackAccent }) => {
	const frame = useCurrentFrame();
	const { width, height } = useVideoConfig();

	// "Land" animation: scale 0.98→1.0 + opacity 0→1 nos primeiros 10 frames
	const landFrames = 10;
	const opacity = interpolate(frame, [0, landFrames], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const scale = interpolate(frame, [0, landFrames], [0.98, 1.0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const bg = card.bg ?? card.background ?? fallbackBg;
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

	const padding = Math.round(Math.min(width, height) * 0.07);

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
				/>
			</div>
		</AbsoluteFill>
	);
};

function isDarkBg(bg: string): boolean {
	// Normalize "#RRGGBB"
	if (!bg || !bg.startsWith("#") || bg.length < 7) return false;
	const r = parseInt(bg.slice(1, 3), 16);
	const g = parseInt(bg.slice(3, 5), 16);
	const b = parseInt(bg.slice(5, 7), 16);
	const luma = 0.299 * r + 0.587 * g + 0.114 * b;
	return luma < 128;
}

// ---------- Layout router ----------

const LayoutRouter: React.FC<{
	card: TypographicCard;
	brand: TypographicBrand;
	fg: string;
	accent: string;
	hairlineColor: string;
}> = ({ card, brand, fg, accent, hairlineColor }) => {
	const layout = (card.layout ?? "center").toLowerCase();

	switch (layout) {
		case "hero-number":
		case "centered-display":
		case "two-line-stack":
		case "triple-negation-stack":
		case "center":
		case "synthesis":
			return (
				<HeroLayout card={card} brand={brand} fg={fg} accent={accent} />
			);
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
				<HeadlineSubLayout
					card={card}
					brand={brand}
					fg={fg}
					accent={accent}
				/>
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
				<SplitBinaryLayout
					card={card}
					brand={brand}
					fg={fg}
					accent={accent}
				/>
			);
		case "eyebrow-list":
			return (
				<EyebrowListLayout
					card={card}
					brand={brand}
					fg={fg}
					accent={accent}
				/>
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
			return (
				<HeroLayout card={card} brand={brand} fg={fg} accent={accent} />
			);
	}
};

// ---------- Common atoms ----------

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
						<span style={{ color: accentColor ?? color }}>
							{accentWord}
						</span>
					) : null}
				</React.Fragment>
			))}
		</span>
	);
};

function getText(
	field: TypographicCard["headline"] | TypographicCard["sub"],
): string | null {
	if (!field) return null;
	if (typeof field === "string") return field;
	return field.text;
}

function getTextObj(
	field: TypographicCard["headline"] | TypographicCard["sub"],
): {
	text: string;
	weight?: number;
	sizePx?: number;
	tracking?: string;
	accentWord?: string;
	accentColor?: string;
	color?: string;
	font?: string;
} | null {
	if (!field) return null;
	if (typeof field === "string") return { text: field };
	return field;
}

// ---------- Layout: Hero / Center / Two-line stack / Synthesis ----------

const HeroLayout: React.FC<{
	card: TypographicCard;
	brand: TypographicBrand;
	fg: string;
	accent: string;
}> = ({ card, brand, fg, accent }) => {
	const font = brand.fontHeading ?? "Montserrat";
	const tracking = brand.trackingHero ?? "-0.05em";

	// Cards podem trazer headline (string|obj), headlineLines[], lines[], ou title
	if (card.lines && card.lines.length > 0) {
		return (
			<div style={center()}>
				{card.lines.map((line, i) => (
					<div
						key={i}
						style={{
							fontFamily: font,
							fontWeight: line.weight ?? 950,
							fontSize: line.sizePx ?? 120,
							letterSpacing: line.tracking ?? tracking,
							lineHeight: 0.95,
							textAlign: "center",
							color: line.color ?? fg,
							marginBottom: i < card.lines!.length - 1 ? 16 : 0,
						}}
					>
						<AccentText
							text={line.text}
							accentWord={line.accentWord}
							accentColor={line.accentColor ?? accent}
							color={line.color ?? fg}
						/>
					</div>
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
						<div
							key={i}
							style={{
								fontFamily: font,
								fontWeight: 950,
								fontSize: card.headlineLines!.length > 2 ? 140 : 160,
								letterSpacing: tracking,
								lineHeight: 0.95,
								textAlign: "center",
								color: fg,
								marginBottom: i < card.headlineLines!.length - 1 ? 16 : 0,
							}}
						>
							<AccentText
								text={text}
								accentWord={accentWord}
								accentColor={accent}
								color={fg}
							/>
						</div>
					);
				})}
				{card.sub ? (
					<div
						style={{
							marginTop: 48,
							fontFamily: brand.fontBody ?? font,
							fontWeight: 500,
							fontSize: 36,
							color: brand.textMuted ?? "#9CA3AF",
							textAlign: "center",
						}}
					>
						{getText(card.sub)}
					</div>
				) : null}
			</div>
		);
	}

	const headlineObj = getTextObj(card.headline);
	if (headlineObj) {
		return (
			<div style={center()}>
				<div
					style={{
						fontFamily: headlineObj.font ?? font,
						fontWeight: headlineObj.weight ?? 950,
						fontSize: headlineObj.sizePx ?? 140,
						letterSpacing: headlineObj.tracking ?? tracking,
						lineHeight: 0.95,
						textAlign: "center",
						color: headlineObj.color ?? fg,
					}}
				>
					<AccentText
						text={headlineObj.text}
						accentWord={headlineObj.accentWord}
						accentColor={headlineObj.accentColor ?? accent}
						color={headlineObj.color ?? fg}
					/>
				</div>
				{card.sub ? <SubBlock sub={card.sub} brand={brand} /> : null}
			</div>
		);
	}

	if (card.title) {
		return (
			<div style={center()}>
				<div
					style={{
						fontFamily: font,
						fontWeight: card.titleWeight ?? 950,
						fontSize: card.titleSize ?? 120,
						letterSpacing: tracking,
						lineHeight: 0.95,
						textAlign: "center",
						color: card.titleColor ?? fg,
					}}
				>
					{card.title}
				</div>
				{card.sub ? <SubBlock sub={card.sub} brand={brand} /> : null}
			</div>
		);
	}

	return null;
};

// ---------- Layout: Eyebrow + Title ----------

const EyebrowTitleLayout: React.FC<{
	card: TypographicCard;
	brand: TypographicBrand;
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
				<div
					key={i}
					style={{
						fontFamily: font,
						fontWeight: 950,
						fontSize: 160,
						letterSpacing: tracking,
						lineHeight: 0.95,
						textAlign: "center",
						color: fg,
						marginBottom: i < (card.headlineLines ?? []).length - 1 ? 12 : 0,
					}}
				>
					{text}
				</div>
			))}
			{!card.headlineLines && getTextObj(card.headline) ? (
				<HeadlineBlock headline={card.headline!} fg={fg} accent={accent} brand={brand} />
			) : null}
			{card.sub ? <SubBlock sub={card.sub} brand={brand} /> : null}
		</div>
	);
};

// ---------- Layout: Headline + Sub ----------

const HeadlineSubLayout: React.FC<{
	card: TypographicCard;
	brand: TypographicBrand;
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

// ---------- Layout: Anchor (numbered) ----------

const AnchorLayout: React.FC<{
	card: TypographicCard;
	brand: TypographicBrand;
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
				paddingLeft: 80,
				paddingRight: 80,
			}}
		>
			{card.number ? (
				<div
					style={{
						fontFamily: brand.fontMono ?? brand.fontData ?? brand.fontHeading ?? "Montserrat",
						fontWeight: 700,
						fontSize: 56,
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
					width: 64,
					height: 1,
					background: hairlineColor,
					marginBottom: 32,
				}}
			/>
			{card.title ? (
				<div
					style={{
						fontFamily: font,
						fontWeight: 950,
						fontSize: 120,
						letterSpacing: brand.trackingDisplay ?? "-0.04em",
						lineHeight: 0.95,
						color: fg,
						marginBottom: 32,
					}}
				>
					{card.title}
				</div>
			) : null}
			{card.sub ? (
				<div
					style={{
						fontFamily: brand.fontBody ?? font,
						fontWeight: 500,
						fontSize: 44,
						color: brand.textMuted ?? "#9CA3AF",
						lineHeight: 1.25,
					}}
				>
					{getText(card.sub)}
				</div>
			) : null}
		</div>
	);
};

// ---------- Layout: Split Binary ----------

const SplitBinaryLayout: React.FC<{
	card: TypographicCard;
	brand: TypographicBrand;
	fg: string;
	accent: string;
}> = ({ card, brand, fg, accent }) => {
	const font = brand.fontHeading ?? "Montserrat";
	const split = card.split;
	if (!split) return null;

	const separator = split.separator ?? "×";
	const separatorColor = split.separatorColor ?? accent;
	const size = split.sizePx ?? 120;

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
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: 48,
					fontFamily: font,
					fontWeight: split.weight ?? 950,
					fontSize: size,
					letterSpacing: split.tracking ?? "-0.04em",
					color: fg,
					lineHeight: 0.95,
				}}
			>
				<span>{split.left}</span>
				<span style={{ color: separatorColor }}>{separator}</span>
				<span>{split.right}</span>
			</div>
		</div>
	);
};

// ---------- Layout: Eyebrow + list ----------

const EyebrowListLayout: React.FC<{
	card: TypographicCard;
	brand: TypographicBrand;
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

// ---------- Layout: CTA ----------

const CtaLayout: React.FC<{
	card: TypographicCard;
	brand: TypographicBrand;
	fg: string;
	accent: string;
	hairlineColor: string;
}> = ({ card, brand, fg, accent, hairlineColor }) => {
	const font = brand.fontHeading ?? "Montserrat";
	const monoFont = brand.fontMono ?? brand.fontData ?? brand.fontHeading ?? "Montserrat";

	// URL may be string or object
	const urlText =
		typeof card.url === "string"
			? card.url
			: card.url?.text ?? null;
	const urlObj = typeof card.url === "object" ? card.url : undefined;

	return (
		<div style={center()}>
			{(card.headlineLines ?? []).map((text, i) => (
				<div
					key={i}
					style={{
						fontFamily: font,
						fontWeight: 950,
						fontSize: 160,
						letterSpacing: brand.trackingHero ?? "-0.05em",
						lineHeight: 0.95,
						textAlign: "center",
						color: fg,
						marginBottom: 8,
					}}
				>
					{text}
				</div>
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
							width: 64,
							height: 1,
							background: hairlineColor,
							margin: "40px auto",
							opacity: 0.5,
						}}
					/>
					<div
						style={{
							fontFamily: urlObj?.font ?? card.urlFont ?? monoFont,
							fontWeight: urlObj?.weight ?? card.urlWeight ?? 700,
							fontSize: urlObj?.sizePx ?? card.urlSize ?? 32,
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

// ---------- Shared atoms ----------

const HeadlineBlock: React.FC<{
	headline: NonNullable<TypographicCard["headline"]>;
	fg: string;
	accent: string;
	brand: TypographicBrand;
}> = ({ headline, fg, accent, brand }) => {
	const obj = getTextObj(headline);
	if (!obj) return null;
	const font = brand.fontHeading ?? "Montserrat";
	return (
		<div
			style={{
				fontFamily: obj.font ?? font,
				fontWeight: obj.weight ?? 950,
				fontSize: obj.sizePx ?? 120,
				letterSpacing: obj.tracking ?? brand.trackingDisplay ?? "-0.04em",
				lineHeight: 0.95,
				textAlign: "center",
				color: obj.color ?? fg,
				marginBottom: 32,
			}}
		>
			<AccentText
				text={obj.text}
				accentWord={obj.accentWord}
				accentColor={obj.accentColor ?? accent}
				color={obj.color ?? fg}
			/>
		</div>
	);
};

const SubBlock: React.FC<{
	sub: NonNullable<TypographicCard["sub"]>;
	brand: TypographicBrand;
}> = ({ sub, brand }) => {
	const obj = getTextObj(sub);
	if (!obj) return null;
	return (
		<div
			style={{
				marginTop: 32,
				fontFamily: obj.font ?? brand.fontBody ?? "Montserrat",
				fontWeight: obj.weight ?? 500,
				fontSize: obj.sizePx ?? 40,
				color: obj.color ?? brand.textMuted ?? "#9CA3AF",
				textAlign: "center",
				lineHeight: 1.3,
			}}
		>
			{obj.text}
		</div>
	);
};

const EyebrowBlock: React.FC<{
	text: string;
	style?: TypographicCard["eyebrowStyle"];
	brand: TypographicBrand;
	color: string;
	hairlineColor: string;
}> = ({ text, style, brand, color, hairlineColor }) => {
	return (
		<>
			<div
				style={{
					fontFamily: brand.fontHeading ?? "Montserrat",
					fontWeight: style?.weight ?? 800,
					fontSize: style?.sizePx ?? 28,
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
					width: 48,
					height: 1,
					background: hairlineColor,
					margin: "0 auto 32px",
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
