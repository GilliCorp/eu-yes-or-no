import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Bilingual string. Every piece of user-facing text must exist in BOTH
 * Icelandic (`is`) and English (`en`) — the build fails otherwise.
 */
const loc = z.object({
  is: z.string().min(1),
  en: z.string().min(1),
});

/**
 * A source citation. Every factual claim must carry at least one of these
 * (see `point` below) — this is the structural neutrality guarantee.
 */
const source = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  publisher: z.string().optional(),
  // primary = law / court / statistics office; academic; advocacy (framing only); press
  tier: z.enum(['primary', 'academic', 'advocacy', 'press']),
});

/**
 * A single factual point (a gain, a loss, or an honestly-flagged unknown).
 * `sources` has `.min(1)` — a point with no source is a BUILD ERROR. 🔒
 */
const point = z.object({
  claim: loc,
  sources: z.array(source).min(1),
  affects: z.array(z.string()).optional(),
  confidence: z.enum(['high', 'medium', 'low']).default('medium'),
});

/**
 * A sourced statistic shown as a labelled bar (e.g. "fisheries = 40% of goods
 * exports"). Generic + reusable across chapters. Like `point`, `sources` has
 * `.min(1)` — a bar with no source is a BUILD ERROR. 🔒
 */
const statBar = z.object({
  label: loc,
  valuePct: z.number().min(0).max(100),
  caption: loc,
  sources: z.array(source).min(1),
});

/**
 * A topic "dossier" — one chapter of the site (e.g. "Your money").
 * Structured data, not prose: plain-language summary + what's true today
 * under the EEA vs. what changes as a full EU member, with gains/losses/unknowns.
 */
const dossiers = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{yaml,yml,json}', base: './src/content/dossiers' }),
  schema: z.object({
    order: z.number().int(), // chapter ordering (everyday-life-first)
    title: loc,
    tldr: loc, // one line
    summary: loc, // plain-language paragraph
    today: loc, // what's already true under the EEA / Schengen now
    asMember: loc, // what changes with full EU membership
    // Optional unsourced "scope note" callout rendered near the top of a chapter —
    // narrative prose (like summary/today), NOT a sourced ledger point. Used to flag
    // a topic that isn't directly an EU matter but earns a place for context.
    contextNote: loc.optional(),
    gains: z.array(point).default([]),
    losses: z.array(point).default([]),
    uncertain: z.array(point).default([]),
    // Optional sourced "what's at stake" stat-bars, rendered as the chapter hook.
    stakes: z.array(statBar).optional(),
    // Render the "build your household" calculator on this chapter.
    calculator: z.boolean().default(false),
    basket: z.boolean().default(false),
    lastReviewed: z.coerce.date(),
    confidence: z.enum(['high', 'medium', 'low']),
  }),
});

export const collections = { dossiers };
