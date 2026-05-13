import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

/**
 * Side-effect module: imported once from Root.tsx so Remotion preloads
 * the typefaces every composition relies on BEFORE any frame renders.
 *
 * Without this, Headless Chromium falls back to a system default (often
 * Helvetica/Arial), which is why renders look "right" in local preview
 * (user has Montserrat installed) but show generic sans in the final MP4.
 *
 * Montserrat is the project-wide default. JetBrains Mono is loaded as
 * opt-in for brands that explicitly set `brand.fontMono = "JetBrains Mono"`.
 */

loadMontserrat("normal", {
	weights: ["400", "500", "600", "700", "800", "900"],
	subsets: ["latin", "latin-ext"],
});

loadJetBrainsMono("normal", {
	weights: ["400", "500", "600", "700"],
	subsets: ["latin"],
});
