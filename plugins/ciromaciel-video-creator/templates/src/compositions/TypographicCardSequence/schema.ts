import { z } from "zod";
import { brandPaletteSchema, defaultBrand } from "../../shared/BrandPalette";

/**
 * Schema do TypographicCardSequence.
 *
 * Aceita N cards lineares (corte seco entre eles). O schema é deliberadamente
 * permissivo: vários builders escreveram props.json com vocabulários diferentes
 * (headline string vs object, headlineLines[] vs lines[], etc) — aqui todos os
 * campos comuns são opcionais, o componente normaliza no render.
 *
 * Layouts conhecidos:
 *   "hero-number"          — número/keyword gigante (hook)
 *   "eyebrow-title"        — eyebrow pequeno + título grande
 *   "headline-sub"         — título + subtítulo
 *   "body-text"            — bloco corrido
 *   "anchor"               — número + título + sub (lista de âncoras)
 *   "split-binary"         — esquerda × direita (comparação 1 linha)
 *   "synthesis"            — formula tipo "1 + 1"
 *   "cta"                  — call-to-action com url monospaced
 *   "two-line-stack"       — 2 linhas grandes empilhadas (alias)
 *   "eyebrow-list"         — eyebrow + lista vertical
 *   "triple-negation-stack"— 3 linhas de negação stagger reveal
 *   "centered-display"     — alias de hero-number
 *   "center"               — alias genérico
 *
 * Layouts não-listados caem no renderer "auto" (best-effort centered).
 */

// ---------- Line / sub-element schemas ----------

const lineSchema = z.object({
	text: z.string(),
	weight: z.number().optional(),
	sizePx: z.number().optional(),
	tracking: z.string().optional(),
	accentWord: z.string().optional(),
	accentColor: z.string().optional(),
	color: z.string().optional(),
});

const textObjSchema = z.object({
	text: z.string(),
	weight: z.number().optional(),
	sizePx: z.number().optional(),
	tracking: z.string().optional(),
	accentWord: z.string().optional(),
	accentColor: z.string().optional(),
	color: z.string().optional(),
	font: z.string().optional(),
});

// headline / sub / url podem ser string OU object — accept either.
const stringOrTextObj = z.union([z.string(), textObjSchema]);

const splitSchema = z.object({
	left: z.string(),
	right: z.string(),
	separator: z.string().default("×"),
	separatorColor: z.string().optional(),
	weight: z.number().optional(),
	sizePx: z.number().optional(),
	tracking: z.string().optional(),
});

const accentSpanSchema = z.object({
	text: z.string(),
	color: z.string().optional(),
});

// ---------- Card schema (permissivo — todos os campos opcionais exceto timing) ----------

const cardSchema = z.object({
	id: z.string().optional(),

	// Timing — aceita seg ou frame. Pelo menos um par precisa estar presente
	// na vida real, mas pra schema-loose deixamos opcional e o componente fallback.
	fromSec: z.number().optional(),
	toSec: z.number().optional(),
	fromFrame: z.number().optional(),
	toFrame: z.number().optional(),

	// Aliases legados
	atSec: z.number().optional(),
	durationSec: z.number().optional(),

	// Âncora pra reconciliação áudio↔slide no /render-video Passo 3.
	// remotion-builder preenche; /render-video lê e sobrescreve fromSec/toSec
	// com os timings reais do TTS via lookup no audio-meta.json.
	audioSegmentId: z.string().optional(),
	audioSegmentIds: z.array(z.string()).optional(),

	// Background — aceita "bg" ou "background"
	bg: z.string().optional(),
	background: z.string().optional(),
	// Foreground — aceita "fg" ou "textColor"
	fg: z.string().optional(),
	textColor: z.string().optional(),

	// Layout enum (string aberto — componente lida com unknown)
	layout: z.string().default("center"),

	// Accent
	accent: z.string().optional(),
	accentColor: z.string().optional(),
	accentSpans: z.array(accentSpanSchema).optional(),

	// Eyebrow
	eyebrow: z.string().nullable().optional(),
	eyebrowStyle: z
		.object({
			weight: z.number().optional(),
			sizePx: z.number().optional(),
			tracking: z.string().optional(),
			uppercase: z.boolean().optional(),
			color: z.string().optional(),
		})
		.optional(),

	// Conteúdo — vários nomes possíveis
	headline: stringOrTextObj.optional(),
	headlineLines: z.array(z.string()).optional(),
	headlineAccentToken: z.string().optional(),
	headlineAccentTokens: z.array(z.string()).optional(),
	lines: z.array(lineSchema).optional(),
	list: z.array(lineSchema).optional(),

	title: z.string().optional(),
	titleSize: z.number().optional(),
	titleWeight: z.number().optional(),
	titleColor: z.string().optional(),

	sub: stringOrTextObj.nullable().optional(),
	subhead: stringOrTextObj.nullable().optional(),
	body: stringOrTextObj.nullable().optional(),
	micro: z.string().nullable().optional(),

	// Anchor-style
	number: z.string().optional(),

	// Binary split
	split: splitSchema.optional(),

	// CTA
	url: z
		.union([
			z.string(),
			z.object({
				text: z.string(),
				font: z.string().optional(),
				weight: z.number().optional(),
				sizePx: z.number().optional(),
				color: z.string().optional(),
			}),
		])
		.optional(),
	urlFont: z.string().optional(),
	urlWeight: z.number().optional(),
	urlSize: z.number().optional(),

	// Visual extras
	hairline: z.boolean().optional(),

	// Stagger
	accentRevealStaggerSec: z.array(z.number()).optional(),
});

// ---------- Captions / audio ----------

const captionSchema = z.object({
	fromSec: z.number().min(0),
	toSec: z.number().min(0),
	text: z.string(),
});

const audioSchema = z.object({
	voPath: z.string().nullable().default(null),
	musicPath: z.string().nullable().default(null),
	duckMusicUnderVo: z.boolean().default(true),
	tickSfx: z
		.object({
			enabled: z.boolean().optional(),
			atSec: z.array(z.number()).optional(),
			note: z.string().optional(),
		})
		.optional(),
});

const transitionSchema = z.object({
	type: z.string().default("hard-cut"),
	durationFrames: z.number().default(0),
});

// ---------- Brand (extends shared schema with careerthesis aliases) ----------

/**
 * Extensão do brandPaletteSchema. Adiciona aliases vistos nos props.json:
 *  - bgLight / bgDark / bgInverse / bgSoft / bgSecondary
 *  - textOnDark / textOnLight / textMuted / textEyebrow / textTertiary
 *  - accentGreen / accentNegative / accentLink
 *  - borderHairline
 *  - fontMono
 *  - trackingHero / trackingDisplay / trackingEyebrow / trackingTight
 *  - radius
 *  - weights / fontWeights / weightDisplay etc
 *  - letterSpacing
 *  - principles
 *
 * Todos opcionais — componente lê via fallback chains.
 */
const extendedBrandSchema = brandPaletteSchema.partial().extend({
	// Background aliases
	bgPrimary: z.string().optional(),
	bgElevated: z.string().optional(),
	bgLight: z.string().optional(),
	bgDark: z.string().optional(),
	bgInverse: z.string().optional(),
	bgSoft: z.string().optional(),
	bgSecondary: z.string().optional(),

	// Text aliases
	textPrimary: z.string().optional(),
	textSecondary: z.string().optional(),
	textTertiary: z.string().optional(),
	textMuted: z.string().optional(),
	textEyebrow: z.string().optional(),
	textOnDark: z.string().optional(),
	textOnLight: z.string().optional(),

	// Accent aliases
	accentPrimary: z.string().optional(),
	accentGreen: z.string().optional(),
	accentNegative: z.string().optional(),
	accentLink: z.string().optional(),

	// Border
	border: z.string().optional(),
	borderHairline: z.string().optional(),
	muted: z.string().optional(),

	// Fonts
	fontHeading: z.string().optional(),
	fontBody: z.string().optional(),
	fontData: z.string().optional(),
	fontMono: z.string().optional(),

	// Tracking
	trackingHero: z.string().optional(),
	trackingDisplay: z.string().optional(),
	trackingTight: z.string().optional(),
	trackingEyebrow: z.string().optional(),

	letterSpacing: z.record(z.string()).optional(),
	weights: z.record(z.number()).optional(),
	fontWeights: z.record(z.number()).optional(),

	weightDisplay: z.number().optional(),
	weightSection: z.number().optional(),
	weightEyebrow: z.number().optional(),
	weightButton: z.number().optional(),
	weightLead: z.number().optional(),
	weightBody: z.number().optional(),

	radius: z.number().optional(),
	principles: z.array(z.string()).optional(),
});

// ---------- Root schema ----------

export const typographicCardSequenceSchema = z.object({
	cards: z.array(cardSchema),
	brand: extendedBrandSchema.default({}),
	captions: z.array(captionSchema).default([]),
	audio: audioSchema.default({
		voPath: null,
		musicPath: null,
		duckMusicUnderVo: true,
	}),
	transition: transitionSchema.default({ type: "hard-cut", durationFrames: 0 }),
	// Default aspect 9:16 — pode ser sobrescrito via Composition width/height
	defaultBg: z.string().default("#F8F8F8"),
	defaultFg: z.string().default("#34322D"),
	defaultAccent: z.string().default("#51CF66"),
	captionsBurned: z.boolean().default(true),
});

export type TypographicCardSequenceProps = z.infer<
	typeof typographicCardSequenceSchema
>;
export type TypographicCard = z.infer<typeof cardSchema>;
export type TypographicBrand = z.infer<typeof extendedBrandSchema>;

export const typographicCardSequenceDefaults: TypographicCardSequenceProps = {
	cards: [
		{
			id: "C01-hook",
			fromSec: 0,
			toSec: 3,
			bg: "#34322D",
			fg: "#F8F8F8",
			accent: "#51CF66",
			layout: "hero-number",
			headlineLines: ["8 COISAS", "QUE NINGUÉM", "LARGA"],
			headlineAccentToken: "8",
			hairline: true,
		},
		{
			id: "C02-setup",
			fromSec: 3,
			toSec: 7,
			bg: "#F8F8F8",
			fg: "#34322D",
			accent: "#51CF66",
			layout: "eyebrow-title",
			eyebrow: "EDGAR SCHEIN · MIT",
			headlineLines: ["AS 8", "ÂNCORAS"],
			sub: "vou listar em 50 segundos. anota a que ressoa.",
			hairline: true,
		},
		{
			id: "C03-anchor",
			fromSec: 7,
			toSec: 13,
			bg: "#F8F8F8",
			fg: "#34322D",
			accent: "#51CF66",
			layout: "anchor",
			number: "01",
			title: "TÉCNICA",
			sub: "não larga o ofício",
			hairline: true,
		},
		{
			id: "C04-cta",
			fromSec: 13,
			toSec: 16,
			bg: "#34322D",
			fg: "#F8F8F8",
			accent: "#51CF66",
			layout: "cta",
			headlineLines: ["QUIZ", "NA BIO"],
			url: "careerthesis.com/quiz-ancora",
			hairline: true,
		},
	],
	brand: {
		bgPrimary: "#F8F8F8",
		bgDark: "#34322D",
		textPrimary: "#34322D",
		textOnDark: "#F8F8F8",
		textMuted: "#9CA3AF",
		textSecondary: "#6B7280",
		accentPrimary: "#51CF66",
		accentGreen: "#51CF66",
		border: "#E5E7EB",
		borderHairline: "#E5E7EB",
		fontHeading: "Montserrat",
		fontBody: "Montserrat",
		fontMono: "Montserrat",
		fontData: "Montserrat",
		radius: 8,
		trackingHero: "-0.05em",
		trackingDisplay: "-0.04em",
		trackingEyebrow: "0.12em",
	},
	captions: [],
	audio: {
		voPath: null,
		musicPath: null,
		duckMusicUnderVo: true,
	},
	transition: { type: "hard-cut", durationFrames: 0 },
	defaultBg: "#F8F8F8",
	defaultFg: "#34322D",
	defaultAccent: "#51CF66",
	captionsBurned: true,
};
