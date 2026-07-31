/* Types only — no values. `site.ts` re-exports everything here, so consumers
   import from one place: `import { site, type Member } from '@/data/site'`. */

/** 'YYYY' | 'YYYY-MM' | 'YYYY-MM-DD'. Formatted by lib/format.ts. */
export type IsoDate = string

/**
 * Medal tier. A UNION, not a TypeScript `enum` — tsconfig sets
 * `erasableSyntaxOnly: true`, which makes `tsc -b` reject enums outright.
 */
export type MedalTier = 'gold' | 'silver' | 'bronze' | 'finalist' | 'participant'

export type CompetitionKind = 'project-showcase' | 'hackathon' | 'ctf' | 'other'

export type BrandAccent = 'cyan' | 'blue' | 'violet'

/**
 * Every image on the site.
 *
 * `alt` is REQUIRED and lives next to the content, so a photo can't be added
 * without writing alt text. Use `alt: ''` only when the image is purely
 * decorative and adjacent text already conveys the same thing.
 *
 * `width`/`height` are the intrinsic dimensions of `src` and are non-optional —
 * they are what prevents layout shift.
 */
export interface ResponsiveImage {
  src: string
  srcSet?: string
  sizes?: string
  width: number
  height: number
  alt: string
}

/* ─────────────────────────────── achievements ─────────────────────────────── */

export interface Achievement {
  id: string
  /** The event. Copy elsewhere leads with the TEAM, not this. */
  event: string
  organizer: string
  /** Display copy: 'Champion' | '1st Runners-up' | 'Finalist'. */
  rankLabel: string
  /** Drives every visual. Deliberately decoupled from `rankLabel`. */
  tier: MedalTier
  kind: CompetitionKind
  date: IsoDate
  location?: string
  summary?: string
  /** Small meta chip only — the project never leads an achievement card. */
  builtWith?: string
  photo?: ResponsiveImage
}

/* ──────────────────────────────── projects ──────────────────────────────── */

export type ProjectStatus = 'live' | 'in-progress' | 'archived' | 'concept'
export type ProjectLinkKind = 'repo' | 'demo' | 'video' | 'writeup'

export interface ProjectLink {
  label: string
  href: string
  kind: ProjectLinkKind
}

export interface Project {
  id: string
  name: string
  tagline: string
  description: string
  /** Rendered as mono chips. */
  stack: string[]
  status: ProjectStatus
  year: string
  /** Which competition the team took it to. */
  builtFor?: string
  /** Tints the generated fallback panel when `cover` is absent. */
  accent: BrandAccent
  cover?: ResponsiveImage
  links?: ProjectLink[]
  /** Headline metrics, shown as a small stat row. */
  metrics?: { label: string; value: string }[]
}

/* ───────────────────────────────── people ───────────────────────────────── */

export type MemberKind = 'member' | 'mentor'

export interface Member {
  id: string
  name: string
  /**
   * EXPLICIT initials — never auto-derived. Bangladeshi naming conventions
   * ('Kawsher HRidoy', 'Shafiur Rahman Shafim') produce wrong or ugly results
   * from any generic first-letter algorithm, and the styling of a person's own
   * name is theirs to choose, not an algorithm's.
   */
  initials: string
  role: string
  kind: MemberKind
  department?: string
  /** Omitted where the member has not told us their specialisms — the card
      simply shows fewer chips rather than the site inventing any. */
  focus?: string[]
  /** Absent → <Avatar> renders the gradient monogram hexagon instead. */
  photo?: ResponsiveImage
  /** cyan → blue → violet, cycling, so the roster reads as the brand gradient. */
  accent: BrandAccent
  links?: SocialLink[]
}

/* ────────────────────────────── links & social ────────────────────────────── */

export type SocialPlatform =
  | 'facebook'
  | 'github'
  | 'linkedin'
  | 'telegram'
  | 'instagram'
  | 'behance'
  | 'x'
  | 'email'
  | 'ctftime'
  | 'website'

export interface SocialLink {
  platform: SocialPlatform
  label: string
  href: string
  handle?: string
  /** true → rendered as a full Button rather than an icon link. */
  primary?: boolean
}

/* ────────────────────────────────── CTF ────────────────────────────────── */

export type CtfPlatformId = 'ctftime' | 'tryhackme' | 'hackthebox' | 'picoctf' | 'overthewire'

export interface CtfPlatformLink {
  id: string
  platform: CtfPlatformId
  name: string
  href: string
  note?: string
  status: 'active' | 'planned'
}

/**
 * Numbers copied by hand from ctftime.org.
 *
 * Why not fetched: CTFtime's JSON API sends no `Access-Control-Allow-Origin`
 * header, so a browser `fetch` is blocked by CORS. Live figures would need a
 * build-time fetch or a serverless proxy. `updated` makes staleness visible.
 */
export interface CtfTimeStats {
  ratingPlace: number
  countryPlace?: number
  ratingPoints: number
  eventsPlayed: number
  year: number
  updated: IsoDate
}

export interface CtfConfig {
  /**
   * ── THE FEATURE FLAG ──
   * null = not registered yet. Set it to the numeric id from
   * ctftime.org/team/<id> and the live card turns on. Nothing else to change.
   */
  teamId: string | null
  headline: string
  body: string
  focusAreas: { label: string; detail: string }[]
  /** Static content for the terminal panel. No typewriter, no blink. */
  terminalLines: string[]
  platforms: CtfPlatformLink[]
  stats?: CtfTimeStats
}

/* ───────────────────────────── nav / config ───────────────────────────── */

export interface NavItem {
  id: string
  label: string
}

export interface Pillar {
  id: string
  label: string
  detail: string
  /** The three glyphs printed along the bottom of the team's own logo. */
  icon: 'code' | 'terminal' | 'shield'
  accent: BrandAccent
}

export interface SiteConfig {
  name: string
  shortName: string
  tagline: string
  taglineWords: [string, string, string]
  secondaryTagline: string
  closingLine: string
  university: string
  city: string
  country: string
  founded: string
  /** ABSOLUTE canonical origin — used to build OG URLs. */
  url: string
  /** <=160 chars; used for meta description and og:description. */
  description: string
  logo: ResponsiveImage
  nav: NavItem[]
  pillars: [Pillar, Pillar, Pillar]
  socials: SocialLink[]
  contactEmail: string
}
