/**
 * Build-time prerender.
 *
 * Renders <App /> (homepage) and each public member page to static HTML so the
 * shipped pages contain real content instead of an empty <div id="root">.
 *
 * Why this matters: Googlebot can execute JavaScript, but it is slower and
 * queued — and social crawlers (Facebook, LinkedIn, Slack) never run JS at all.
 * Without this, the raw HTML has zero words in it.
 *
 * Run automatically as part of `bun run build` (see package.json).
 *
 * This is prerendering, not SSR: output is a static file, there is no server
 * runtime, and the client still hydrates normally on top of the markup.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { App, LeaderPage, MemberPage } from '../src/entry-prerender'
import { leader, shafiur, site } from '../src/data/site'
import type { MemberProfile } from '../src/data/types'

const DIST = resolve(import.meta.dirname, '..', 'dist')
const INDEX = resolve(DIST, 'index.html')
const ORIGIN = site.url
const ORG_ID = `${ORIGIN}/#organization`
const WEBSITE_ID = `${ORIGIN}/#website`

const template = readFileSync(INDEX, 'utf8')

if (!template.includes('<div id="root"></div>')) {
  throw new Error(
    'prerender: could not find an empty <div id="root"></div> in dist/index.html. ' +
      'Did the build output change, or has prerender already run?',
  )
}

const homeMarkup = renderToString(createElement(App))
writeFileSync(INDEX, template.replace('<div id="root"></div>', `<div id="root">${homeMarkup}</div>`), 'utf8')
logWords('home', homeMarkup)

writeMemberPage(
  renderToString(createElement(LeaderPage)),
  {
    id: leader.id,
    path: leader.path,
    publicName: leader.publicName,
    officialName: leader.officialName,
    jobTitle: leader.jobTitle,
    pageTitle: leader.pageTitle,
    pageDescription: leader.pageDescription,
    imagePath: leader.imagePath,
    imageWidth: leader.imageWidth,
    imageHeight: leader.imageHeight,
    imageAlt: `Portrait of ${leader.publicName}, Cortex Crew team lead`,
    biography: leader.biography,
    sameAs: leader.sameAs,
    knowsAbout: ['Machine Learning', 'Artificial Intelligence', 'Backend Development', 'Cyber Security'],
    keywords:
      'Kawsher HRidoy, Cortex Crew, Cortex Crew DIU, Daffodil International University, DIU, AI developer, machine learning, hackathon team Bangladesh',
  },
)

writeMemberPage(renderToString(createElement(MemberPage, { profile: shafiur })), {
  ...shafiur,
  imageAlt: `Portrait of ${shafiur.publicName}, Cortex Crew full-stack developer`,
})

/* ── sitemap ──────────────────────────────────────────────────────────────
   Written here rather than kept as a static file so `lastmod` is always the
   real build date. A hand-maintained lastmod goes stale silently, and a stale
   or absent one gives Google no recrawl signal after a content change.

   `changefreq` and `priority` are deliberately omitted — Google has stated it
   ignores both. */
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${ORIGIN}/</loc>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>${ORIGIN}${leader.path}</loc>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>${ORIGIN}${shafiur.path}</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`
writeFileSync(resolve(DIST, 'sitemap.xml'), sitemap, 'utf8')
console.log(`prerender: wrote sitemap.xml (lastmod ${today}, 3 URLs)`)

function logWords(label: string, html: string) {
  const words = html
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  console.log(`prerender: ${label} ${(html.length / 1024).toFixed(1)} KB of markup (~${words} words)`)
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function replaceOnce(source: string, search: string, replacement: string, label: string): string {
  const index = source.indexOf(search)
  if (index === -1) {
    throw new Error(`prerender: could not find ${label}`)
  }
  return source.slice(0, index) + replacement + source.slice(index + search.length)
}

type ProfileHead = Pick<
  MemberProfile,
  | 'id'
  | 'path'
  | 'publicName'
  | 'officialName'
  | 'jobTitle'
  | 'pageTitle'
  | 'pageDescription'
  | 'imagePath'
  | 'imageWidth'
  | 'imageHeight'
  | 'biography'
  | 'sameAs'
  | 'knowsAbout'
  | 'keywords'
> & { imageAlt: string }

function writeMemberPage(markup: string, profile: ProfileHead) {
  const html = applyProfileHead(template, profile).replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`,
  )
  const dir = resolve(DIST, profile.id)
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), html, 'utf8')
  /* Also write the clean-URL sibling so `vite preview` (and Vercel cleanUrls)
     serve /<id> without falling back to the homepage SPA shell. */
  writeFileSync(resolve(DIST, `${profile.id}.html`), html, 'utf8')
  logWords(profile.path, markup)
}

function applyProfileHead(html: string, profile: ProfileHead): string {
  const pageUrl = `${ORIGIN}${profile.path}`
  const imageUrl = `${ORIGIN}${profile.imagePath}`
  const personId = `${ORIGIN}/#${profile.id}`
  const title = escapeHtml(profile.pageTitle)
  const description = escapeHtml(profile.pageDescription)
  const imageAlt = escapeHtml(profile.imageAlt)

  let next = html
  next = replaceOnce(
    next,
    '<title>Cortex Crew DIU — Hackathon &amp; Project Showcase Team</title>',
    `<title>${title}</title>`,
    `${profile.id} title`,
  )
  next = replaceOnce(
    next,
    'content="Cortex Crew is a student hackathon and project showcase team at Daffodil International University (DIU), led by Kawsher HRidoy. See our 2026 record."',
    `content="${description}"`,
    `${profile.id} meta description`,
  )
  next = replaceOnce(
    next,
    '<link rel="canonical" href="https://cortexcrew.vercel.app/" />',
    `<link rel="canonical" href="${pageUrl}" />`,
    `${profile.id} canonical`,
  )
  next = replaceOnce(
    next,
    '<meta name="author" content="Cortex Crew" />',
    `<meta name="author" content="${escapeHtml(profile.publicName)}" />`,
    `${profile.id} author`,
  )
  next = replaceOnce(
    next,
    'content="Cortex Crew, Team Cortex Crew, Daffodil International University, DIU, hackathon team Bangladesh, project showcase, Kawsher HRidoy, Shafiur Rahman Shafim, AL Fahad, Abdullah Al Khalil, CSAD 2026, IEEE ICADHI 2026, RoboFusion 1.0, Dhaka"',
    `content="${escapeHtml(profile.keywords)}"`,
    `${profile.id} keywords`,
  )
  next = replaceOnce(next, '<meta property="og:type" content="website" />', '<meta property="og:type" content="profile" />', `${profile.id} og:type`)
  next = replaceOnce(
    next,
    '<meta property="og:url" content="https://cortexcrew.vercel.app/" />',
    `<meta property="og:url" content="${pageUrl}" />`,
    `${profile.id} og:url`,
  )
  next = replaceOnce(
    next,
    '<meta property="og:title" content="Cortex Crew DIU — Hackathon &amp; Project Showcase Team" />',
    `<meta property="og:title" content="${title}" />`,
    `${profile.id} og:title`,
  )
  next = replaceOnce(
    next,
    'content="A student hackathon and project showcase team based at Daffodil International University (DIU), Dhaka, led by Kawsher HRidoy."',
    `content="${description}"`,
    `${profile.id} og:description`,
  )
  next = replaceOnce(
    next,
    '<meta property="og:image" content="https://cortexcrew.vercel.app/media/og.jpg" />',
    `<meta property="og:image" content="${imageUrl}" />`,
    `${profile.id} og:image`,
  )
  next = replaceOnce(
    next,
    '<meta property="og:image:width" content="1200" />',
    `<meta property="og:image:width" content="${profile.imageWidth}" />`,
    `${profile.id} og:image:width`,
  )
  next = replaceOnce(
    next,
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:height" content="${profile.imageHeight}" />`,
    `${profile.id} og:image:height`,
  )
  next = replaceOnce(
    next,
    '<meta property="og:image:alt" content="Cortex Crew — Code, Collaborate, Conquer" />',
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    `${profile.id} og:image:alt`,
  )
  next = replaceOnce(
    next,
    '<meta name="twitter:card" content="summary_large_image" />',
    '<meta name="twitter:card" content="summary" />',
    `${profile.id} twitter:card`,
  )
  next = replaceOnce(
    next,
    '<meta name="twitter:title" content="Cortex Crew DIU — Hackathon &amp; Project Showcase Team" />',
    `<meta name="twitter:title" content="${title}" />`,
    `${profile.id} twitter:title`,
  )
  next = replaceOnce(
    next,
    'content="A student hackathon and project showcase team based at Daffodil International University (DIU), Dhaka, led by Kawsher HRidoy."',
    `content="${description}"`,
    `${profile.id} twitter:description`,
  )
  next = replaceOnce(
    next,
    '<meta name="twitter:image" content="https://cortexcrew.vercel.app/media/og.jpg" />',
    `<meta name="twitter:image" content="${imageUrl}" />`,
    `${profile.id} twitter:image`,
  )

  const preloadStart = next.indexOf('<!-- LCP preload.')
  const preloadEnd = next.indexOf('/>', next.indexOf('href="/media/logo-512.webp"')) + 2
  if (preloadStart === -1 || preloadEnd < preloadStart) {
    throw new Error(`prerender: could not find homepage LCP preload (${profile.id})`)
  }
  const portraitPreload = `<!-- LCP preload. imagesrcset/imagesizes MUST mirror the profile portrait <img>. -->
    <link
      rel="preload"
      as="image"
      href="${profile.imagePath}"
      imagesrcset="/media/team/${profile.id}-160.webp 160w, /media/team/${profile.id}-240.webp 240w, /media/team/${profile.id}-336.webp 336w"
      imagesizes="(min-width: 768px) 176px, 144px"
      fetchpriority="high"
    />`
  next = next.slice(0, preloadStart) + portraitPreload + next.slice(preloadEnd)

  const jsonStart = next.indexOf('<script type="application/ld+json">')
  const jsonEnd = next.indexOf('</script>', jsonStart)
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error(`prerender: could not find JSON-LD block (${profile.id})`)
  }

  const person = {
    '@type': 'Person',
    '@id': personId,
    name: profile.officialName ?? profile.publicName,
    ...(profile.officialName ? { alternateName: profile.publicName } : {}),
    url: pageUrl,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: profile.imageWidth,
      height: profile.imageHeight,
      caption: profile.publicName,
    },
    jobTitle: profile.jobTitle,
    description: profile.biography[0],
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: site.university,
      url: 'https://daffodilvarsity.edu.bd/',
    },
    memberOf: [{ '@id': ORG_ID }, { '@type': 'CollegeOrUniversity', name: site.university }],
    sameAs: [...profile.sameAs],
    knowsAbout: [...profile.knowsAbout],
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: profile.pageTitle,
        description: profile.pageDescription,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': personId },
        mainEntity: { '@id': personId },
        primaryImageOfPage: imageUrl,
        inLanguage: 'en',
      },
      {
        '@type': ['Organization', 'SportsTeam'],
        '@id': ORG_ID,
        name: site.name,
        url: `${ORIGIN}/`,
        member: { '@id': personId },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${ORIGIN}/`,
        name: site.name,
        publisher: { '@id': ORG_ID },
      },
    ],
  }
  const jsonBlock = `<script type="application/ld+json">\n      ${JSON.stringify(jsonLd, null, 2).replaceAll('\n', '\n      ')}\n    </script>`
  next = next.slice(0, jsonStart) + jsonBlock + next.slice(jsonEnd + '</script>'.length)

  return next
}
