/** Regression checks for site data and the production prerender. Build first. */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { achievements, competitionRecord, members, projects, shafiur, site } from '../src/data/site'
import { formatCount } from '../src/lib/format'
import { AchievementParticipants } from '../src/components/AchievementParticipants'

const root = resolve(import.meta.dirname, '..')
const expectedNames = ['Kawsher Hridoy', 'Shafiur Rahman Shafim', 'Arnob Kumar Paul', 'Fahim Shariar']
const bup = achievements.find((item) => item.id === 'bup-cse-fest-2026')!
const jalani = projects[0]
const progression = '400+ teams → Top 50 → Top 10'

assert.deepEqual(competitionRecord, { total: 7, podiums: 2, finals: 5 })
assert.equal(new Set(achievements.map((item) => item.id)).size, achievements.length)
assert.equal(new Set(projects.map((item) => item.id)).size, projects.length)
assert.equal(achievements.filter((item) => item.tier === 'finalist')[0], bup)
assert.equal(bup.rankLabel, 'Top 10 Finalist')
assert.equal(bup.tier, 'finalist')
assert.equal(bup.kind, 'hackathon')
assert.equal(bup.date, '2026-09')
assert.equal(bup.location, undefined)
assert.equal(bup.photo, undefined)
assert.equal(bup.builtWith, jalani.name)
assert.ok(bup.summary?.includes(progression))
assert.deepEqual(bup.participants?.map((item) => item.name), expectedNames)
assert.deepEqual(bup.participants?.map((item) => item.role), ['Team Leader', undefined, undefined, undefined])
assert.deepEqual(members.map((item) => item.id), [
  'kawsher-hridoy', 'shafiur-rahman', 'al-fahad', 'abdullah-al-khalil',
])
assert.deepEqual(shafiur.workIds, ['bd-krishibid'])
assert.equal(projects.length, 6)
assert.equal(jalani.id, 'jalani-control-tower')
assert.equal(jalani.status, 'live')
assert.match(jalani.description, /Simulation only/)
assert.match(jalani.description, /does not connect to or control real fuel infrastructure/)
assert.equal(jalani.metrics, undefined)
assert.deepEqual(jalani.links, [{
  label: 'Source', href: 'https://github.com/kawsher-hridoy/jalani-control-tower', kind: 'repo',
}])
assert.ok(site.description.length <= 160)
assert.equal(formatCount(7, true), 'Seven')
assert.equal(formatCount(5), 'five')
assert.equal(formatCount(11), '11')
assert.equal(renderToStaticMarkup(createElement(AchievementParticipants, { event: bup.event })), '')
assert.equal(renderToStaticMarkup(createElement(AchievementParticipants, { event: bup.event, participants: [] })), '')
console.log('PASS data: 7 results, 2 podiums, 5 finals, 6 projects, BUP lineup, unchanged crew and selected work')

for (const [id, heading] of [
  ['', 'Seven competitions. Two podiums, five finals.'],
  ['kawsher-hridoy', 'Seven results, under his lead.'],
  ['shafiur-rahman', 'Seven results, with Cortex Crew.'],
]) {
  const html = readFileSync(resolve(root, 'dist', id, 'index.html'), 'utf8')
  assert.ok(html.includes(heading), `${id || 'home'}: heading`)
  assert.ok(html.includes(progression), `${id || 'home'}: progression`)
  assert.ok(html.includes('dateTime="2026-09"') || html.includes('datetime="2026-09"'))
  assert.ok(html.includes('SEP 2026'))
  const lineup = html.match(/<ul aria-label="BUP CSE Fest 2026 Hackathon team lineup"[^>]*>([\s\S]*?)<\/ul>/)?.[1]
  if (id) {
    assert.ok(lineup, `${id}: accessible lineup`)
    assert.equal((lineup.match(/<li\b/g) ?? []).length, 4)
    expectedNames.forEach((name) => assert.ok(lineup.includes(name)))
    assert.ok(lineup.includes('Team Leader'))
  } else {
    assert.equal(lineup, undefined, 'home: no event lineup')
    const recordStart = html.indexOf('id="achievements"')
    const record = html.slice(recordStart, html.indexOf('</section>', recordStart))
    assert.ok(!record.includes('Event lineup'))
    expectedNames.forEach((name) => assert.ok(!record.includes(name), `home record: no ${name}`))
  }
  assert.doesNotMatch(html, /(?:six competition results|four finals reached|Arvin Ahmed Alok|@diu\.edu\.bd|Interface &amp; Presentation)/i)
  assert.ok(html.includes(`href="${site.url}${id ? `/${id}` : '/'}"`), `${id || 'home'}: canonical`)
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1])['@graph']
  if (!id) {
    const org = graph.find((item: { '@id': string }) => item['@id'] === `${site.url}/#organization`)
    assert.equal(org.award.length, 7)
    assert.ok(org.award.some((award: string) => award.includes('Top 10 Finalist — BUP CSE Fest 2026 Hackathon')))
    assert.equal(org.member.length, 4)
    // The aggregate finalist tally must not inherit BUP's more specific rank.
    const hero = html.slice(html.indexOf('id="hero"'), html.indexOf('</section>', html.indexOf('id="hero"')))
    assert.match(hero, />5<\/span>.*?>Finalist<\/span>/)
    assert.ok(!hero.includes('Top 10 Finalist'))
    const projectStart = html.indexOf('id="projects"')
    assert.ok(html.indexOf('Jalani Control Tower', projectStart) < html.indexOf('Darktrace3', projectStart))
    assert.ok(html.includes('Six systems the team designed and built'))
  } else {
    const person = graph.find((item: { '@type': string }) => item['@type'] === 'Person')
    assert.ok(person.sameAs.includes(id === 'kawsher-hridoy' ? 'https://hridoy.xyz' : 'https://github.com/Shafiur0'))
    assert.equal(person.name, id === 'kawsher-hridoy' ? 'Md Kawsher Ahmed' : 'Shafiur Rahman Shafim')
    if (id === 'kawsher-hridoy') assert.ok(html.includes(jalani.description))
    else assert.ok(!html.includes(jalani.description))
    assert.equal(readFileSync(resolve(root, 'dist', `${id}.html`), 'utf8'), html)
  }
  for (const anchor of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(anchor[0], /rel="[^"]*noreferrer[^"]*"/)
    assert.match(anchor[0], /rel="[^"]*noopener[^"]*"/)
  }
  console.log(`PASS prerender: /${id}, BUP rank/date, ${id ? 'profile lineup' : 'no homepage lineup'}, counts, canonical, identity JSON-LD, safe links`)
}

const summary = readFileSync(resolve(root, 'public/llms.txt'), 'utf8')
assert.ok(summary.includes(progression))
assert.ok(summary.includes('seven competition results'))
assert.ok(summary.includes('September 2026'))
expectedNames.forEach((name) => assert.ok(summary.includes(name)))
const sitemap = readFileSync(resolve(root, 'dist/sitemap.xml'), 'utf8')
assert.equal((sitemap.match(/<loc>/g) ?? []).length, 3)
console.log('PASS summaries: llms.txt and 3-URL sitemap')
