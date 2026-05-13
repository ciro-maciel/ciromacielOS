import { z } from "zod";
import {
	typographicCardSequenceSchema,
	type TypographicCard,
	type TypographicBrand,
} from "../TypographicCardSequence/schema";

/**
 * LongformCardSequence — schema estende TypographicCardSequence com:
 *  - blocks[] (capítulos com title + startSec)
 *  - chapters[] (alias compatível com YouTube chapter markers)
 *  - patternInterrupt flag por card (renderização especial — silêncio + 1 frase)
 *  - brollSlots[] (placeholders cinza com label do asset esperado)
 *  - leftLabel/rightLabel/items (compat com SplitScreenComparison props.json existentes,
 *    pra youtube-01 que escreveu o spec dele assumindo Split mas usando 870s)
 */

// Pull pieces from TypographicCardSequence schema for reuse
const baseShape = typographicCardSequenceSchema.shape;

// Block / chapter
const blockSchema = z.object({
	id: z.string().optional(),
	blockTitle: z.string().optional(),
	title: z.string().optional(), // alias
	blockStartSec: z.number(),
	color: z.string().optional(),
});

const chapterSchema = z.object({
	title: z.string(),
	startSec: z.number(),
});

const brollSlotSchema = z.object({
	id: z.string().optional(),
	fromSec: z.number(),
	toSec: z.number(),
	label: z.string().default("[ b-roll placeholder ]"),
	hint: z.string().optional(),
});

// Extended card — herda TypographicCard mas adiciona patternInterrupt + brollSlot fields
const longformCardSchema = z
	.object({
		patternInterrupt: z.boolean().optional(),
		silenceTrailSec: z.number().optional(),
		blockId: z.string().optional(),
		isBrollSlot: z.boolean().optional(),
		brollLabel: z.string().optional(),
	})
	.passthrough(); // todos os campos do TypographicCard são opcionais e permissivos

// SplitScreenComparison-style items (compat youtube-01 props.json shape)
const itemSchema = z.object({
	label: z.string(),
	left: z.string(),
	right: z.string(),
	atSec: z.number().min(0),
});

export const longformCardSequenceSchema = z.object({
	// cards é o coração — mesma shape do TypographicCardSequence + extras longform
	cards: z.array(longformCardSchema).default([]),

	// Compat com SplitScreenComparison props.json (youtube-01 escreveu assim)
	leftLabel: z.string().optional(),
	rightLabel: z.string().optional(),
	items: z.array(itemSchema).optional(),

	// Estrutura longform
	blocks: z.array(blockSchema).default([]),
	chapters: z.array(chapterSchema).default([]),
	brollSlots: z.array(brollSlotSchema).default([]),

	// Resto vem do base
	brand: baseShape.brand,
	captions: baseShape.captions,
	audio: baseShape.audio,
	transition: baseShape.transition,
	defaultBg: z.string().default("#FFFFFF"),
	defaultFg: z.string().default("#34322D"),
	defaultAccent: z.string().default("#51CF66"),
	captionsBurned: z.boolean().default(true),
	showChapterMarkers: z.boolean().default(true),
	durationSec: z.number().default(870),
});

export type LongformCardSequenceProps = z.infer<
	typeof longformCardSequenceSchema
>;
export type LongformCard = TypographicCard & {
	patternInterrupt?: boolean;
	silenceTrailSec?: number;
	blockId?: string;
	isBrollSlot?: boolean;
	brollLabel?: string;
};
export type LongformBrand = TypographicBrand;

export const longformCardSequenceDefaults: LongformCardSequenceProps = {
	cards: [
		{
			id: "C01-cold-open",
			fromSec: 0,
			toSec: 15,
			bg: "#FFFFFF",
			fg: "#34322D",
			accent: "#51CF66",
			layout: "hero-number",
			headlineLines: ["DECLARADA", "≠", "OBEDECIDA"],
			headlineAccentToken: "≠",
			hairline: true,
		},
		{
			id: "C02-introducao",
			fromSec: 15,
			toSec: 60,
			bg: "#F8F8F8",
			fg: "#34322D",
			accent: "#51CF66",
			layout: "eyebrow-title",
			eyebrow: "+ INTRODUÇÃO",
			headlineLines: ["SCHEIN · MIT", "12 ANOS"],
			sub: "44 alunos rastreados",
		},
		{
			id: "pattern-interrupt-pause",
			fromSec: 330,
			toSec: 338,
			bg: "#34322D",
			fg: "#F8F8F8",
			accent: "#51CF66",
			layout: "hero-number",
			headlineLines: ["PAUSA"],
			sub: "qual ressoou até aqui?",
			patternInterrupt: true,
			silenceTrailSec: 3,
		},
	],
	leftLabel: undefined,
	rightLabel: undefined,
	items: undefined,
	blocks: [
		{ blockTitle: "INTRODUÇÃO", blockStartSec: 0 },
		{ blockTitle: "AS 8 ÂNCORAS", blockStartSec: 210 },
		{ blockTitle: "DECLARADA × OBEDECIDA", blockStartSec: 450 },
		{ blockTitle: "AÇÃO", blockStartSec: 630 },
		{ blockTitle: "CTA", blockStartSec: 780 },
	],
	chapters: [
		{ title: "Cold open", startSec: 0 },
		{ title: "As 8 âncoras", startSec: 210 },
		{ title: "Declarada × Obedecida", startSec: 450 },
		{ title: "Plano de ação", startSec: 630 },
		{ title: "CTA", startSec: 780 },
	],
	brollSlots: [],
	brand: {
		bgPrimary: "#FFFFFF",
		bgElevated: "#F8F8F8",
		bgDark: "#34322D",
		textPrimary: "#34322D",
		textOnDark: "#F8F8F8",
		textSecondary: "#6B7280",
		textMuted: "#9CA3AF",
		accentPrimary: "#51CF66",
		accentGreen: "#51CF66",
		border: "#E5E7EB",
		borderHairline: "#E5E7EB",
		fontHeading: "Montserrat",
		fontBody: "Montserrat",
		fontMono: "JetBrains Mono",
		fontData: "JetBrains Mono",
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
	defaultBg: "#FFFFFF",
	defaultFg: "#34322D",
	defaultAccent: "#51CF66",
	captionsBurned: true,
	showChapterMarkers: true,
	durationSec: 870,
};
