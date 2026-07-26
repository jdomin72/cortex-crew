/**
 * Build-time prerender.
 *
 * Renders <App /> to static HTML and injects it into dist/index.html, so the
 * shipped page contains real content instead of an empty <div id="root">.
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
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { App } from '../src/entry-prerender'

const DIST = resolve(import.meta.dirname, '..', 'dist')
const INDEX = resolve(DIST, 'index.html')

const html = renderToString(createElement(App))

const template = readFileSync(INDEX, 'utf8')

if (!template.includes('<div id="root"></div>')) {
  throw new Error(
    'prerender: could not find an empty <div id="root"></div> in dist/index.html. ' +
      'Did the build output change, or has prerender already run?',
  )
}

writeFileSync(INDEX, template.replace('<div id="root"></div>', `<div id="root">${html}</div>`), 'utf8')

const words = html
  .replace(/<[^>]+>/g, ' ')
  .split(/\s+/)
  .filter(Boolean).length

console.log(`prerender: injected ${(html.length / 1024).toFixed(1)} KB of markup (~${words} words)`)
