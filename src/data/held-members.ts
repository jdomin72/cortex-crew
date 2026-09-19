/* ── held off the live roster ──
   Recoverable profiles. Nothing on the site imports this file — do not add
   an import. Move an entry back into `members` in `site.ts` to publish it
   again. Portraits stay in `public/media/team/` so they can be wired up
   without re-running the media pipeline. */

import type { Member } from './types'

export const heldMembers: Member[] = [
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
    id: 'arvin-ahmed-alok',
    name: 'Arvin Ahmed Alok',
    initials: 'AA',
    role: 'Developer · Frontend',
    kind: 'member',
    /* Three chips, not four: given by the team on 2026-08-01. He has no public
       repo or portfolio to check these against, so a fourth would be invented
       rather than shortened. Fewer chips is the documented behaviour. */
    focus: ['React', 'JavaScript', 'UI Implementation'],
    accent: 'violet',
    photo: {
      src: '/media/team/arvin-ahmed-alok-240.webp',
      srcSet:
        '/media/team/arvin-ahmed-alok-160.webp 160w, ' +
        '/media/team/arvin-ahmed-alok-240.webp 240w, ' +
        '/media/team/arvin-ahmed-alok-336.webp 336w',
      sizes: '112px',
      width: 240,
      height: 240,
      alt: 'Arvin Ahmed Alok, Developer',
    },
    /* No email here on purpose. The address supplied for him was a university
       one — a @diu.edu.bd host AND a student ID in the local part — so it is
       both halves of what the publishing rules forbid, and what the standing
       `dist/` grep is there to catch. It stays off the site until he gives a
       personal address; the team address in `site.contactEmail` reaches him
       meanwhile. Do not add it back. */
    links: [
      { platform: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/arvinahmed.alok' },
      {
        platform: 'linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/arvin-ahmed-52b22a3a8',
      },
      { platform: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/arvin_alok19' },
    ],
  },
]
