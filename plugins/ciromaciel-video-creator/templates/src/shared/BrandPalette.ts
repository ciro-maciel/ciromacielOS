/**
 * Brand palette schema — usado por todos os templates.
 * Vem populado via props.json (extraído do visual-brand.md do cliente pelo remotion-builder).
 */

import { z } from "zod";

export const brandPaletteSchema = z.object({
	bgPrimary: z.string().default("#0A0E1A"),
	bgElevated: z.string().default("#141A2B"),
	textPrimary: z.string().default("#F5F7FA"),
	textSecondary: z.string().default("#8B95B0"),
	accentPrimary: z.string().default("#3DDC97"),
	accentNegative: z.string().default("#FF5C7A"),
	accentLink: z.string().default("#5B8DEF"),
	border: z.string().default("#1F2940"),
	fontHeading: z.string().default("Montserrat"),
	fontBody: z.string().default("Montserrat"),
	fontData: z.string().default("Montserrat"),
});

export type BrandPalette = z.infer<typeof brandPaletteSchema>;

export const defaultBrand: BrandPalette = {
	bgPrimary: "#0A0E1A",
	bgElevated: "#141A2B",
	textPrimary: "#F5F7FA",
	textSecondary: "#8B95B0",
	accentPrimary: "#3DDC97",
	accentNegative: "#FF5C7A",
	accentLink: "#5B8DEF",
	border: "#1F2940",
	fontHeading: "Montserrat",
	fontBody: "Montserrat",
	fontData: "Montserrat",
};
