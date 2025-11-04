/**
 * Typography System - Universal Design System
 * 
 * A comprehensive, project-agnostic typography scale for design consistency.
 * Designed to work across any React/Tailwind project with responsive breakpoints.
 * 
 * Philosophy:
 * - Mobile-first responsive scaling
 * - Semantic naming (display, heading, body, label, etc.)
 * - Consistent font weights and line heights
 * - Accessible text contrast and readability
 * - Tailwind utility-based (no custom CSS needed)
 * 
 * Usage:
 * ```tsx
 * import { typography } from '@/lib/typography';
 * 
 * <h1 className={typography.display.xl}>Hero Headline</h1>
 * <p className={typography.body.lg}>Subtitle text</p>
 * <span className={typography.label.sm}>Caption</span>
 * ```
 */

// ============================================================================
// DISPLAY TEXT (Extra Large Headlines - Hero Sections)
// ============================================================================

export const display = {
  /** Extra extra large display - Hero headlines (5xl → 6xl → 7xl → 8xl) */
  xxl: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] [text-wrap:balance]',
  
  /** Extra large display - Main hero headlines (4xl → 5xl → 6xl → 7xl) */
  xl: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] [text-wrap:balance]',
  
  /** Large display - Section hero headlines (4xl → 5xl → 6xl) */
  lg: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] [text-wrap:balance]',
  
  /** Medium display - Feature headlines (3xl → 4xl → 5xl) */
  md: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight [text-wrap:balance]',
  
  /** Small display - Card headlines (2xl → 3xl → 4xl) */
  sm: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight [text-wrap:balance]',
} as const;

// ============================================================================
// HEADINGS (Page/Section Titles - h1 through h6)
// ============================================================================

export const heading = {
  /** H1 - Page title (3xl → 4xl → 5xl) */
  h1: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight [text-wrap:balance]',
  
  /** H2 - Major section heading (2xl → 3xl → 4xl) */
  h2: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight [text-wrap:balance]',
  
  /** H3 - Subsection heading (xl → 2xl → 3xl) */
  h3: 'text-xl md:text-2xl lg:text-3xl font-bold tracking-tight leading-tight',
  
  /** H4 - Card/Component heading (lg → xl → 2xl) */
  h4: 'text-lg md:text-xl lg:text-2xl font-semibold tracking-tight leading-snug',
  
  /** H5 - Small section heading (base → lg → xl) */
  h5: 'text-base md:text-lg lg:text-xl font-semibold leading-snug',
  
  /** H6 - Minimal heading (sm → base → lg) */
  h6: 'text-sm md:text-base lg:text-lg font-semibold leading-snug',
} as const;

// ============================================================================
// BODY TEXT (Paragraph, Content, Descriptions)
// ============================================================================

export const body = {
  /** Extra large body - Feature descriptions (lg → xl → 2xl) */
  xl: 'text-lg md:text-xl lg:text-2xl leading-relaxed',
  xlMuted: 'text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed',
  
  /** Large body - Subtitles, lead paragraphs (base → lg → xl) */
  lg: 'text-base md:text-lg lg:text-xl leading-relaxed',
  lgMuted: 'text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed',
  
  /** Medium/Regular body - Standard paragraph text (sm → base) */
  md: 'text-sm md:text-base leading-normal',
  mdMuted: 'text-sm md:text-base text-muted-foreground leading-normal',
  
  /** Small body - Secondary text, captions (xs → sm) */
  sm: 'text-xs md:text-sm leading-normal',
  smMuted: 'text-xs md:text-sm text-muted-foreground leading-normal',
  
  /** Extra small body - Fine print, metadata (text-xs only) */
  xs: 'text-xs leading-snug',
  xsMuted: 'text-xs text-muted-foreground leading-snug',
} as const;

// ============================================================================
// LABELS (UI Labels, Badges, Tags, Form Labels)
// ============================================================================

export const label = {
  /** Large label - Primary UI labels (sm → base) */
  lg: 'text-sm md:text-base font-medium leading-none',
  lgMuted: 'text-sm md:text-base text-muted-foreground font-medium leading-none',
  
  /** Medium label - Standard form labels (xs → sm) */
  md: 'text-xs md:text-sm font-medium leading-none',
  mdMuted: 'text-xs md:text-sm text-muted-foreground font-medium leading-none',
  
  /** Small label - Compact UI labels, badges (text-xs only) */
  sm: 'text-xs font-medium leading-none',
  smMuted: 'text-xs text-muted-foreground font-medium leading-none',
  
  /** Extra small label - Tiny badges, status indicators (text-[10px]) */
  xs: 'text-[10px] font-medium leading-none uppercase tracking-wide',
  xsMuted: 'text-[10px] text-muted-foreground font-medium leading-none uppercase tracking-wide',
} as const;

// ============================================================================
// NUMBERS & STATS (Prices, Metrics, Counts - Monospace)
// ============================================================================

export const number = {
  /** Hero number - Large dashboard stats (4xl → 5xl) */
  hero: 'text-4xl md:text-5xl font-bold font-mono tabular-nums',
  
  /** Extra large number - Prominent stats (3xl → 4xl) */
  xl: 'text-3xl md:text-4xl font-bold font-mono tabular-nums',
  
  /** Large number - Feature numbers (2xl → 3xl) */
  lg: 'text-2xl md:text-3xl font-bold font-mono tabular-nums',
  
  /** Medium number - Card totals (xl → 2xl) */
  md: 'text-xl md:text-2xl font-bold font-mono tabular-nums',
  
  /** Small number - Inline prices (base → lg) */
  sm: 'text-base md:text-lg font-semibold font-mono tabular-nums',
  
  /** Extra small number - Compact prices (sm → base) */
  xs: 'text-sm md:text-base font-medium font-mono tabular-nums',
  
  /** Tiny number - Badge counts (text-xs) */
  xxs: 'text-xs font-medium font-mono tabular-nums',
} as const;

// ============================================================================
// INTERACTIVE (Buttons, Links, CTAs)
// ============================================================================

export const interactive = {
  /** Primary large CTA - Hero buttons (base → lg) */
  ctaLg: 'text-base md:text-lg font-semibold leading-none',
  
  /** Primary CTA - Standard buttons (sm → base) */
  cta: 'text-sm md:text-base font-semibold leading-none',
  
  /** Secondary CTA - Small buttons (xs → sm) */
  ctaSm: 'text-xs md:text-sm font-medium leading-none',
  
  /** Large link - Prominent navigation (base → lg) */
  linkLg: 'text-base md:text-lg font-medium leading-none underline-offset-4 hover:underline',
  
  /** Standard link - Inline links (sm → base) */
  link: 'text-sm md:text-base font-medium leading-none underline-offset-4 hover:underline',
  
  /** Small link - Compact navigation (text-xs → sm) */
  linkSm: 'text-xs md:text-sm font-medium leading-none underline-offset-2 hover:underline',
} as const;

// ============================================================================
// SPECIALIZED (Badges, Code, Quotes, Overlines)
// ============================================================================

export const specialized = {
  /** Badge text - Pill-shaped badges (xs → sm) */
  badge: 'text-xs md:text-sm font-semibold leading-none uppercase tracking-wide',
  badgeSm: 'text-[10px] md:text-xs font-semibold leading-none uppercase tracking-wide',
  
  /** Overline - Section labels, categories (xs → sm) */
  overline: 'text-xs md:text-sm font-semibold leading-none uppercase tracking-widest',
  overlineSm: 'text-[10px] md:text-xs font-medium leading-none uppercase tracking-widest',
  
  /** Code/Mono - Code snippets, IDs (sm → base) */
  code: 'text-sm md:text-base font-mono leading-relaxed',
  codeSm: 'text-xs md:text-sm font-mono leading-normal',
  
  /** Quote - Blockquote text (lg → xl) */
  quote: 'text-lg md:text-xl leading-relaxed italic',
  quoteSm: 'text-base md:text-lg leading-relaxed italic',
  
  /** Caption - Image/media captions (xs → sm) */
  caption: 'text-xs md:text-sm text-muted-foreground leading-snug',
  
  /** Helper text - Form hints, tooltips (xs → sm) */
  helper: 'text-xs md:text-sm text-muted-foreground leading-snug',
} as const;

// ============================================================================
// LEGACY ALIASES (For backward compatibility - will be deprecated)
// ============================================================================

/** @deprecated Use `display.xxl` instead */
export const hero = display.xxl;

/** @deprecated Use `body.xl` instead */
export const heroSubtitle = body.xlMuted;

/** @deprecated Use `heading.*` instead */
export const h1 = heading.h1;
export const h2 = heading.h2;
export const h3 = heading.h3;
export const h4 = heading.h4;
export const h5 = heading.h5;
export const h6 = heading.h6;

// ============================================================================
// COMBINED TYPOGRAPHY OBJECT (Main Export)
// ============================================================================

export const typography = {
  display,
  heading,
  body,
  label,
  number,
  interactive,
  specialized,
  
  // Legacy support
  hero,
  heroSubtitle,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  
  // Nested legacy (for existing landing page code)
  landing: {
    heroHeadline: display.xl,
    heroSubtitle: body.xlMuted,
    sectionHeading: heading.h2,
    sectionSubtitle: body.lgMuted,
    featureHeading: heading.h3,
    featureDescription: body.lgMuted,
  },
  
  // Nested legacy (for stats)
  stats: {
    hero: number.hero,
    large: number.xl,
    medium: number.lg,
    small: number.md,
  },
  
  // Nested legacy (for special cases)
  special: {
    ctaLarge: interactive.ctaLg,
    cta: interactive.cta,
    mono: number.sm,
    monoLarge: number.md,
    monoSmall: number.xs,
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Typography utility - combines typography classes with custom classes
 * @param typo - Typography class from typography object
 * @param custom - Additional custom classes
 * @returns Combined class string
 * 
 * @example
 * const className = typoClass(typography.heading.h1, 'mb-4 text-center');
 */
export function typoClass(typo: string, custom?: string): string {
  return custom ? `${typo} ${custom}` : typo;
}

/**
 * Type-safe typography variants for components
 */
export type TypographyVariant =
  // Display
  | 'display-xxl'
  | 'display-xl'
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  // Headings
  | 'heading-h1'
  | 'heading-h2'
  | 'heading-h3'
  | 'heading-h4'
  | 'heading-h5'
  | 'heading-h6'
  // Body
  | 'body-xl'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'body-xs'
  // Labels
  | 'label-lg'
  | 'label-md'
  | 'label-sm'
  | 'label-xs'
  // Numbers
  | 'number-hero'
  | 'number-xl'
  | 'number-lg'
  | 'number-md'
  | 'number-sm'
  | 'number-xs'
  // Interactive
  | 'interactive-cta-lg'
  | 'interactive-cta'
  | 'interactive-cta-sm'
  | 'interactive-link-lg'
  | 'interactive-link'
  | 'interactive-link-sm'
  // Specialized
  | 'specialized-badge'
  | 'specialized-overline'
  | 'specialized-code'
  | 'specialized-quote'
  | 'specialized-caption'
  // Legacy
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

/**
 * Get typography classes by variant name (with full type safety)
 * @param variant - Typography variant name
 * @returns Typography className string
 * 
 * @example
 * const headingClass = getTypography('heading-h1');
 * const bodyClass = getTypography('body-lg');
 */
export function getTypography(variant: TypographyVariant): string {
  const map: Record<TypographyVariant, string> = {
    // Display
    'display-xxl': display.xxl,
    'display-xl': display.xl,
    'display-lg': display.lg,
    'display-md': display.md,
    'display-sm': display.sm,
    // Headings
    'heading-h1': heading.h1,
    'heading-h2': heading.h2,
    'heading-h3': heading.h3,
    'heading-h4': heading.h4,
    'heading-h5': heading.h5,
    'heading-h6': heading.h6,
    // Body
    'body-xl': body.xl,
    'body-lg': body.lg,
    'body-md': body.md,
    'body-sm': body.sm,
    'body-xs': body.xs,
    // Labels
    'label-lg': label.lg,
    'label-md': label.md,
    'label-sm': label.sm,
    'label-xs': label.xs,
    // Numbers
    'number-hero': number.hero,
    'number-xl': number.xl,
    'number-lg': number.lg,
    'number-md': number.md,
    'number-sm': number.sm,
    'number-xs': number.xs,
    // Interactive
    'interactive-cta-lg': interactive.ctaLg,
    'interactive-cta': interactive.cta,
    'interactive-cta-sm': interactive.ctaSm,
    'interactive-link-lg': interactive.linkLg,
    'interactive-link': interactive.link,
    'interactive-link-sm': interactive.linkSm,
    // Specialized
    'specialized-badge': specialized.badge,
    'specialized-overline': specialized.overline,
    'specialized-code': specialized.code,
    'specialized-quote': specialized.quote,
    'specialized-caption': specialized.caption,
    // Legacy (for backward compatibility)
    'h1': h1,
    'h2': h2,
    'h3': h3,
    'h4': h4,
    'h5': h5,
    'h6': h6,
  };
  return map[variant];
}

/**
 * Get responsive typography variant based on device breakpoint
 * Useful for dynamic component styling based on screen size
 * 
 * @param baseVariant - Base typography variant
 * @param _breakpoint - Current breakpoint ('mobile' | 'tablet' | 'desktop') - reserved for future use
 * @returns Appropriate typography className
 * 
 * @example
 * const headingClass = getResponsiveTypography('heading-h1', isMobile ? 'mobile' : 'desktop');
 */
export function getResponsiveTypography(
  baseVariant: TypographyVariant,
  _breakpoint?: 'mobile' | 'tablet' | 'desktop'
): string {
  // All variants are already responsive via Tailwind utilities
  // This function exists for explicit breakpoint-based styling if needed
  return getTypography(baseVariant);
}
