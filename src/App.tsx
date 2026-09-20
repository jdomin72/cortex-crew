import { leader, shafiur } from './data/site'
import { SiteFooter } from './components/SiteFooter'
import { SiteNav } from './components/SiteNav'
import { About } from './components/sections/About'
import { Achievements } from './components/sections/Achievements'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
import { Pillars } from './components/sections/Pillars'
import { Projects } from './components/sections/Projects'
import { Team } from './components/sections/Team'
import { LeaderPage } from './pages/LeaderPage'
import { MemberPage } from './pages/MemberPage'

function currentPathname(): string {
  if (typeof window === 'undefined') return '/'
  const path = window.location.pathname.replace(/\/+$/, '')
  return path === '' ? '/' : path
}

function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Pillars />
        <About />
        <Achievements />
        <Projects />
        <Team />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}

export default function App() {
  const path = currentPathname()
  if (path === leader.path) {
    return <LeaderPage />
  }
  if (path === shafiur.path) {
    return <MemberPage profile={shafiur} />
  }
  return <Home />
}
