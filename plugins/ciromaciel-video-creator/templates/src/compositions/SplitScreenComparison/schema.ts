import { z } from "zod";
import { brandPaletteSchema, defaultBrand } from "../../shared/BrandPalette";

const comparisonItemSchema = z.object({
	label: z.string(),
	left: z.string(),
	right: z.string(),
	atSec: z.number().min(0),
});

const captionSchema = z.object({
	fromSec: z.number().min(0),
	toSec: z.number().min(0),
	text: z.string(),
});

const audioSchema = z.object({
	voPath: z.string().nullable().default(null),
	musicPath: z.string().nullable().default(null),
	duckMusicUnderVo: z.boolean().default(true),
});

export const splitScreenComparisonSchema = z.object({
	leftLabel: z.string(),
	rightLabel: z.string(),
	leftScreenshot: z.string().nullable().default(null),
	rightScreenshot: z.string().nullable().default(null),
	items: z.array(comparisonItemSchema),
	brand: brandPaletteSchema,
	captions: z.array(captionSchema).default([]),
	audio: audioSchema.default({
		voPath: null,
		musicPath: null,
		duckMusicUnderVo: true,
	}),
});

export type SplitScreenComparisonProps = z.infer<
	typeof splitScreenComparisonSchema
>;

export const splitScreenComparisonDefaults: SplitScreenComparisonProps = {
	leftLabel: "Competitor",
	rightLabel: "FinFlow",
	leftScreenshot: null,
	rightScreenshot: null,
	items: [
		{ label: "Setup", left: "6 weeks", right: "5 days", atSec: 10 },
		{ label: "Pricing", left: "Contact sales", right: "$499/mo public", atSec: 20 },
		{ label: "Trial", left: "Demo first", right: "Self-serve, no card", atSec: 30 },
	],
	brand: defaultBrand,
	captions: [
		{ fromSec: 0, toSec: 3, text: "Over-engineered for Series A." },
		{ fromSec: 3, toSec: 10, text: "Here's why in 60 seconds." },
	],
	audio: {
		voPath: null,
		musicPath: null,
		duckMusicUnderVo: true,
	},
};
