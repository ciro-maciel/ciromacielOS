import React from "react";

/**
 * FitText — auto-fit text that NEVER bleeds past `maxWidth`.
 *
 * Why this exists:
 *   The card templates use FIXED fontSizes (e.g. 160, 140, 120) inside a
 *   `width: 100%` centered container with no maxWidth/padding. Long headlines
 *   ("DECLARADA ≠ OBEDECIDA") overflow the 1920px (or 1080px vertical) frame —
 *   the first/last glyphs get clipped off-screen.
 *
 * Strategy — Approach A (synchronous DOM measurement):
 *   - Render the text once, measure `scrollWidth` via a ref in `useLayoutEffect`.
 *   - If it overflows `maxWidth`, shrink fontSize by the exact ratio so it fits.
 *   - `useLayoutEffect` runs SYNCHRONOUSLY before the browser paints, and
 *     Remotion captures the frame AFTER paint — so the measured/corrected size
 *     is what ends up in the rendered frame. Deterministic: same input text +
 *     same font => same scrollWidth => same fitted size, every frame.
 *   - The `useState` is seeded with a char-based ESTIMATE (no DOM needed) so the
 *     very first layout pass is already close — avoids a visible flash and
 *     guarantees a sane value even if measurement is somehow skipped.
 *
 * Determinism notes:
 *   - No async timers, no rAF, no network. Pure layout math.
 *   - Fonts are preloaded in Root.tsx (shared/fonts.ts) before any frame
 *     renders, so `scrollWidth` is stable across frames.
 *
 * Text that already fits at `maxFontSize` is left EXACTLY as-is (never shrunk).
 *
 * Children may include <AccentText> (accent-colored word) — FitText only wraps
 * and scales; the accent span keeps working untouched.
 *
 * Multi-line: render one <FitText> per line so each line fits independently
 * (a short line stays large, only the long line shrinks).
 */

// Rough average glyph width as a fraction of fontSize for Montserrat ~950
// uppercase. Used only for the initial (pre-measurement) estimate.
const CHAR_RATIO = 0.62;

type FitTextProps = {
	/** Text content. Prefer `text` for plain strings (enables exact char estimate). */
	text?: string;
	/** Arbitrary children (e.g. <AccentText>). If given, used instead of `text`. */
	children?: React.ReactNode;
	/** Largest fontSize allowed (px). Text that fits at this size is NOT shrunk. */
	maxFontSize: number;
	/** Available width in px the text must never exceed. */
	maxWidth: number;
	fontFamily?: string;
	fontWeight?: number;
	letterSpacing?: string | number;
	color?: string;
	lineHeight?: number | string;
	textAlign?: React.CSSProperties["textAlign"];
	/** Extra style passthrough (e.g. marginBottom). Won't override fit logic. */
	style?: React.CSSProperties;
};

function estimateText(children: React.ReactNode, fallbackText?: string): string {
	if (typeof fallbackText === "string") return fallbackText;
	// Best-effort: pull strings out of children for the initial estimate.
	const out: string[] = [];
	const walk = (node: React.ReactNode): void => {
		if (node == null || node === false) return;
		if (typeof node === "string" || typeof node === "number") {
			out.push(String(node));
			return;
		}
		if (Array.isArray(node)) {
			node.forEach(walk);
			return;
		}
		if (React.isValidElement(node)) {
			const props = node.props as { text?: string; children?: React.ReactNode };
			if (typeof props.text === "string") out.push(props.text);
			else walk(props.children);
		}
	};
	walk(children);
	return out.join("");
}

export const FitText: React.FC<FitTextProps> = ({
	text,
	children,
	maxFontSize,
	maxWidth,
	fontFamily = "Montserrat",
	fontWeight = 950,
	letterSpacing,
	color,
	lineHeight = 0.95,
	textAlign = "center",
	style,
}) => {
	const ref = React.useRef<HTMLDivElement>(null);

	// Initial char-based estimate so the first layout pass is already close.
	const initialFontSize = React.useMemo(() => {
		const estimate = estimateText(children ?? text, text);
		const len = Math.max(1, estimate.trim().length);
		const charFit = maxWidth / (len * CHAR_RATIO);
		return Math.min(maxFontSize, charFit);
	}, [children, text, maxWidth, maxFontSize]);

	const [fontSize, setFontSize] = React.useState(initialFontSize);

	// Synchronous DOM measurement — runs before paint, Remotion captures after.
	React.useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;
		// Measure at maxFontSize to know the natural width, then scale down.
		// We temporarily set maxFontSize, read scrollWidth, compute the fit.
		el.style.fontSize = `${maxFontSize}px`;
		const naturalWidth = el.scrollWidth;
		let next = maxFontSize;
		if (naturalWidth > maxWidth && naturalWidth > 0) {
			// Shrink by exact ratio (minus a hair for sub-pixel safety).
			next = maxFontSize * (maxWidth / naturalWidth) * 0.998;
		}
		el.style.fontSize = `${next}px`;
		setFontSize(next);
	}, [text, children, maxFontSize, maxWidth, fontFamily, fontWeight, letterSpacing]);

	return (
		<div
			ref={ref}
			style={{
				...style,
				fontFamily,
				fontWeight,
				fontSize,
				letterSpacing,
				color,
				lineHeight,
				textAlign,
				// Keep it on one logical line so scrollWidth reflects the true
				// natural width; the parent container handles vertical stacking.
				whiteSpace: "nowrap",
				maxWidth,
			}}
		>
			{children ?? text}
		</div>
	);
};
