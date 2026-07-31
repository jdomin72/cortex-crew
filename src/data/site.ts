/* ══════════════════════════════════════════════════════════════════════════
   ALL SITE CONTENT LIVES HERE.
   Edit this file to add a result, a project, or a member. Nothing else needs
   to change.

   ⭐ FRAMING RULE — the team is the subject, never the project.
      ✅ "Cortex Crew placed 1st Runners-up at ICADHI 2026, with Niro."
      ❌ "Niro won 1st Runners-up."
      Projects are evidence of what the team can do, not the headline.
   ══════════════════════════════════════════════════════════════════════════ */

import type { Achievement, CtfConfig, Member, Project, SiteConfig } from './types'

export * from './types'

/* ─────────────────────────── media helpers ─────────────────────────── */

const AWARD_SIZES = '(min-width: 1024px) 46vw, (min-width: 640px) 90vw, 92vw'

function award(slug: string, alt: string) {
  return {
    src: `/media/awards/${slug}-720.webp`,
    srcSet:
      `/media/awards/${slug}-480.webp 480w, ` +
      `/media/awards/${slug}-720.webp 720w, ` +
      `/media/awards/${slug}-1080.webp 1080w`,
    sizes: AWARD_SIZES,
    width: 720,
    height: 450,
    alt,
  }
}

/**
 * Build a member portrait reference.
 *
 * To add one: save the original as assets-src/team/<member-id>.jpg (that folder
 * is gitignored — originals never ship), run `bun run media`, then set
 * `photo: portrait('<member-id>', 'Name, role')` on that member. Members
 * without a photo render the monogram <Avatar>, which is a designed variant
 * rather than a placeholder, so a mixed row still reads as a system.
 */
export function portrait(slug: string, alt: string) {
  return {
    src: `/media/team/${slug}-240.webp`,
    srcSet:
      `/media/team/${slug}-160.webp 160w, ` +
      `/media/team/${slug}-240.webp 240w, ` +
      `/media/team/${slug}-336.webp 336w`,
    sizes: '112px',
    width: 240,
    height: 240,
    alt,
  }
}

/* ──────────────────────────────── site ──────────────────────────────── */

export const site: SiteConfig = {
  name: 'Cortex Crew',
  shortName: 'CORTEX CREW',
  tagline: 'CODE • COLLABORATE • CONQUER',
  taglineWords: ['CODE', 'COLLABORATE', 'CONQUER'],
  secondaryTagline: 'Building Solutions · Breaking Limits · Securing the Future',
  closingLine: "We don't just participate, we make an impact.",
  university: 'Daffodil International University',
  city: 'Dhaka',
  country: 'Bangladesh',
  founded: '2026',
  url: 'https://cortexcrew.vercel.app',
  description:
    'Cortex Crew is a competition team at Daffodil International University, Dhaka. Five competition results in 2026 — one championship, one runners-up, three finals.',

  logo: {
    src: '/media/logo-512.webp',
    srcSet: '/media/logo-256.webp 256w, /media/logo-512.webp 512w, /media/logo-768.webp 768w',
    sizes: '(min-width: 1024px) 224px, (min-width: 640px) 160px, 80px',
    width: 512,
    height: 512,
    alt: 'Cortex Crew emblem — a circuit-board letter C inside a hexagon',
  },

  nav: [
    { id: 'achievements', label: 'record' },
    { id: 'projects', label: 'work' },
    { id: 'team', label: 'crew' },
    { id: 'ctf', label: 'ctf' },
    { id: 'contact', label: 'contact' },
  ],

  pillars: [
    {
      id: 'showcase',
      label: 'Project Showcase',
      detail: 'We take working systems to the stage, not slide decks.',
      icon: 'code',
      accent: 'cyan',
    },
    {
      id: 'hackathon',
      label: 'Hackathon',
      detail: 'Ship under pressure, demo live, defend every number.',
      icon: 'terminal',
      accent: 'blue',
    },
    {
      id: 'ctf',
      label: 'CTF',
      detail: 'The next arena — offensive security, as a team sport.',
      icon: 'shield',
      accent: 'violet',
    },
  ],

  contactEmail: 'info.cortexcrew@gmail.com',

  socials: [
    {
      platform: 'facebook',
      label: 'Facebook',
      href: 'https://facebook.com/teamcortexcrew',
      handle: '@teamcortexcrew',
      primary: true,
    },
    {
      platform: 'github',
      label: 'GitHub',
      href: 'https://github.com/kawsher-hridoy',
      handle: 'kawsher-hridoy',
    },
  ],
}

/* ───────────────────────────── achievements ─────────────────────────────
   Five results from 2026: one Champion, one 1st Runners-up, three Finalist.

   ⚠️ ONLY list events with a real result. Reaching the final counts; merely
   entering does not. Infinity AI Buildfest 2026 and both IUT Techathon rounds
   are deliberately absent — the team took part and did not reach a final, so
   they are not results and must not be counted anywhere on the site.

   Copy leads with the RESULT and the TEAM; `builtWith` is a small meta chip.
   ─────────────────────────────────────────────────────────────────────── */

export const achievements: Achievement[] = [
  {
    id: 'csad-2026',
    event: 'CSAD 2026 — Project Showcasing Competition',
    organizer: 'Cyber Security Centre, Daffodil International University',
    rankLabel: 'Champion',
    tier: 'gold',
    kind: 'project-showcase',
    date: '2026-01',
    location: 'Dhaka, Bangladesh',
    builtWith: 'Darktrace3',
    summary:
      'Our first competition as a team, and we took the top prize. Cyber Security Awareness Day put every project on one stage in front of a judging panel — Cortex Crew came away Champion.',
    photo: award(
      'csad-2026',
      'Cortex Crew receiving the Champion prize cheque on stage at Cyber Security Awareness Day 2026, Daffodil International University',
    ),
  },
  {
    id: 'icadhi-2026',
    event: 'IEEE ICADHI 2026 — Project Showcase',
    organizer: 'IEEE DIU Student Branch',
    rankLabel: '1st Runners-up',
    tier: 'silver',
    kind: 'project-showcase',
    date: '2026-06',
    location: 'Dhaka, Bangladesh',
    builtWith: 'Niro',
    summary:
      'An IEEE international congress on AI and digital health. We placed second overall against a national field.',
    photo: award(
      'icadhi-2026',
      'Cortex Crew holding the 1st Runners-up cheque at the IEEE ICADHI 2026 closing and award ceremony',
    ),
  },
  {
    id: 'ai-hackathon-2026',
    event: 'AI Innovation Hackathon 2026 — From Learning to Impact',
    organizer: 'Dept. of CSE, Daffodil International University',
    rankLabel: 'Finalist',
    tier: 'finalist',
    kind: 'hackathon',
    date: '2026-07',
    location: 'Smart City, Ashulia, Dhaka',
    builtWith: 'Autopilot',
    summary:
      'Reached the on-site final, where a surprise problem statement was handed out on the day and had to be built on top of our existing system in 2.5 hours.',
  },
  {
    id: 'diu-ai-2026',
    event: 'AI Project Competition 2026',
    organizer: 'Dept. of CSE, Daffodil International University',
    rankLabel: 'Finalist',
    tier: 'finalist',
    kind: 'project-showcase',
    date: '2026-07',
    location: 'Dhaka, Bangladesh',
    builtWith: 'AI Mentor',
    summary:
      'Selected for the final assessment round and demoed live at our own booth to a judging panel.',
  },
  {
    id: 'dss-2026',
    event: '5th Data Science Summit',
    organizer: 'Daffodil International University',
    rankLabel: 'Finalist',
    tier: 'finalist',
    kind: 'project-showcase',
    date: '2026-07',
    location: 'Dhaka, Bangladesh',
    builtWith: 'Niro',
    summary:
      'Judged on the data story: turning unstructured paper records into structured, longitudinal health data.',
  },
]

/* ──────────────────────────────── projects ────────────────────────────────
   Supporting evidence. Every card exists to say something about the team.
   ───────────────────────────────────────────────────────────────────────── */

export const projects: Project[] = [
  {
    id: 'darktrace3',
    name: 'Darktrace3',
    tagline: 'Tells stealer-malware victims exactly what to lock down',
    description:
      'Most breach checkers only tell you an email address turned up in a leak. Darktrace3 works from malware and infostealer logs instead, so it can tell a person they were compromised by a stealer at all — and show which sites and accounts were exposed, so they know precisely what to change. Passwords are always masked in results; the tool is built for awareness, not harvesting.',
    stack: ['Python', 'Flask', 'SQLite', 'Flask-CORS', 'Gunicorn'],
    status: 'archived',
    year: '2026',
    builtFor: 'CSAD 2026 · Champion',
    accent: 'violet',
    /* No metrics and no repo/demo link, by design: the working build runs on
       real stealer-log data, so a public number, source tree or live search
       would expose real people. Describe the capability, never the corpus. */
  },
  {
    id: 'niro',
    name: 'Niro',
    tagline: 'Patient-owned medical records, read aloud in Bangla',
    description:
      'Patients own their records; an AI reads lab reports and prescriptions in plain Bangla, tracks values over time, and prepares a case summary so a real doctor can review it cheaply. The AI never gives final medical advice — it explains and flags, and consent is a core feature rather than a checkbox.',
    stack: ['FastAPI', 'Next.js', 'PostgreSQL', 'Azure OpenAI', 'Alembic'],
    status: 'archived',
    year: '2026',
    builtFor: 'IEEE ICADHI 2026 · 1st Runners-up',
    accent: 'cyan',
    /* Two, not three — Niro was also entered at Infinity AI Buildfest 2026,
       which the team did not reach a final at, so it is not counted. */
    metrics: [
      { label: 'Competitions', value: '2' },
      { label: 'Best result', value: '1st Runners-up' },
    ],
  },
  {
    id: 'autopilot',
    name: 'Autopilot',
    tagline: 'A GPU cluster that heals itself before it fails',
    description:
      'Reads GPU telemetry, predicts a failure about 100 seconds ahead, then cordons the node and migrates the running job automatically — a closed loop from prediction to recovery. We measured it against the alert rule real clusters use today, on identical held-out data, and published both numbers.',
    stack: ['Python', 'LightGBM', 'FastAPI', 'Kubernetes', 'React', 'Streamlit'],
    status: 'live',
    year: '2026',
    builtFor: 'AI Innovation Hackathon 2026 · Finalist',
    accent: 'blue',
    metrics: [
      { label: 'Precision', value: '0.87' },
      { label: 'Recall', value: '0.94' },
      { label: 'Warning', value: '100 s vs 24 s' },
    ],
    links: [{ label: 'Source', href: 'https://github.com/kawsher-hridoy/autopilot', kind: 'repo' }],
  },
  {
    id: 'ai-mentor',
    name: 'AI Mentor',
    tagline: 'Finds the student who is about to fall behind',
    description:
      'A deterministic engine scores every mentee across eight academic and attendance signals, then an AI turns the numbers into a plain-language brief. The mentor opens a ranked command centre instead of scrolling a flat table — and every score can be audited back to the rule that produced it.',
    stack: ['FastAPI', 'Next.js', 'SQLAlchemy', 'SQLite', 'Azure OpenAI'],
    status: 'live',
    year: '2026',
    builtFor: 'AI Project Competition 2026 · Finalist',
    accent: 'violet',
    metrics: [
      { label: 'Risk signals', value: '8' },
      { label: 'Cohort', value: '50 students' },
    ],
    links: [
      { label: 'Source', href: 'https://github.com/kawsher-hridoy/DIU-AI-Mentor', kind: 'repo' },
    ],
  },
]

/* ───────────────────────────────── people ─────────────────────────────────
   Accents run cyan → blue → violet so the avatar row reproduces the brand
   gradient. Initials are hand-written: no algorithm handles 'Md Kawsher
   Ahmed' or 'Md. Abdul Hye Zebon' correctly.

   Never publish university IDs, @diu.edu.bd addresses, or phone numbers.
   ───────────────────────────────────────────────────────────────────────── */

export const members: Member[] = [
  {
    id: 'kawsher-hridoy',
    name: 'Kawsher HRidoy',
    initials: 'KH',
    role: 'Team Lead · ML & Systems',
    kind: 'member',
    focus: ['Machine Learning', 'Backend', 'Security', 'Integration'],
    accent: 'cyan',
    photo: portrait('kawsher-hridoy', 'Kawsher HRidoy, Team Lead'),
    links: [
      { platform: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/KawsherHRidooy/' },
      { platform: 'github', label: 'GitHub', href: 'https://github.com/kawsher-hridoy' },
      { platform: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/kawsher-hridoy' },
      { platform: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/kawsherhridoy/' },
      { platform: 'email', label: 'Email', href: 'mailto:kawsher@hridoy.xyz' },
    ],
  },
  {
    id: 'shafiur-rahman',
    name: 'Shafiur Rahman Shafim',
    initials: 'SR',
    role: 'Infrastructure & Telemetry',
    kind: 'member',
    focus: ['Linux', 'Cloud Infrastructure', 'Monitoring', 'Deployment'],
    accent: 'blue',
    links: [
      {
        platform: 'facebook',
        label: 'Facebook',
        href: 'https://www.facebook.com/shafiurrahaman.shafim',
      },
      { platform: 'github', label: 'GitHub', href: 'https://github.com/Shafiur0' },
      {
        platform: 'linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/shafiur-rahman-shafim/',
      },
      { platform: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/shafiurshafim' },
      { platform: 'x', label: 'X', href: 'https://x.com/Shafiur792' },
      {
        platform: 'website',
        label: 'Portfolio',
        href: 'https://shafiur-rahaman-shafim.vercel.app/',
      },
    ],
  },
  {
    id: 'arnob-paul',
    name: 'Arnob Kumar Paul',
    initials: 'AP',
    role: 'Interface & Presentation',
    kind: 'member',
    focus: ['Frontend', 'Design', 'Dashboards', 'Demo & Pitch'],
    accent: 'violet',
  },
  {
    id: 'al-fahad',
    name: 'AL Fahad',
    initials: 'AF',
    role: 'UI/UX Designer',
    kind: 'member',
    accent: 'cyan',
    photo: portrait('al-fahad', 'AL Fahad, UI/UX Designer'),
    links: [
      {
        platform: 'facebook',
        label: 'Facebook',
        href: 'https://www.facebook.com/al.fahad.official01',
      },
      { platform: 'behance', label: 'Behance', href: 'https://www.behance.net/alfahad19' },
      { platform: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/alfahad7960/' },
      { platform: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/alfahad19' },
    ],
  },
  {
    id: 'abdullah-al-khalil',
    name: 'Abdullah Al Khalil',
    initials: 'AK',
    role: 'Developer',
    kind: 'member',
    accent: 'blue',
  },
  {
    id: 'arvin-ahmed-alok',
    name: 'Arvin Ahmed Alok',
    initials: 'AA',
    role: 'Developer',
    kind: 'member',
    accent: 'violet',
  },
]

/* ────────────────────────────────── CTF ──────────────────────────────────
   `teamId: null` keeps the live card off. Set it to the numeric id from
   ctftime.org/team/<id> and the card turns on — nothing else changes.
   ───────────────────────────────────────────────────────────────────────── */

export const ctf: CtfConfig = {
  teamId: null,
  headline: 'The next arena',
  body: 'We have spent a year building systems and defending them in front of judges. Capture the Flag is the same discipline pointed the other way — read the system, find what it gets wrong, prove it. We are training now and registering as a team for the next season.',
  focusAreas: [
    { label: 'Web exploitation', detail: 'Injection, auth bypass, access-control flaws' },
    { label: 'Reverse engineering', detail: 'Binary analysis and patching' },
    { label: 'Forensics & OSINT', detail: 'Artefact recovery, traffic and log analysis' },
    { label: 'Cryptography', detail: 'Weak implementations and protocol misuse' },
  ],
  terminalLines: [
    '$ whoami',
    'cortex-crew · Daffodil International University · Dhaka',
    '',
    '$ cat record.txt',
    '5 competitions · 2 podium · 3 finalist',
    '',
    '$ cat roadmap.txt',
    '- weekly HTB + picoCTF drills          [ in progress ]',
    '- register the team on ctftime.org     [ next ]',
    '- first rated event                    [ 2026 ]',
    '',
    '$ ctftime --team',
    '[ pending registration ]',
  ],
  platforms: [
    {
      id: 'htb',
      platform: 'hackthebox',
      name: 'Hack The Box',
      href: 'https://www.hackthebox.com/',
      note: 'Primary practice ground',
      status: 'active',
    },
    {
      id: 'pico',
      platform: 'picoctf',
      name: 'picoCTF',
      href: 'https://picoctf.org/',
      note: 'Fundamentals and drills',
      status: 'active',
    },
    {
      id: 'otw',
      platform: 'overthewire',
      name: 'OverTheWire',
      href: 'https://overthewire.org/wargames/',
      note: 'Wargames',
      status: 'active',
    },
    {
      id: 'ctftime',
      platform: 'ctftime',
      name: 'CTFtime',
      href: 'https://ctftime.org/',
      note: 'Team registration pending',
      status: 'planned',
    },
  ],
}

/** Derived — cannot drift out of sync with `ctf.teamId`. */
export const ctfWidgetEnabled = ctf.teamId !== null
export const ctfTeamUrl = ctf.teamId ? `https://ctftime.org/team/${ctf.teamId}` : null
