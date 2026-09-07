import { leader } from './data/site'
import { SiteFooter } from './components/SiteFooter'
import { SiteNav } from './components/SiteNav'
import { About } from './components/sections/About'
import { Achievements } from './components/sections/Achievements'
import { Contact } from './components/sections/Contact'
import { Ctf } from './components/sections/Ctf'
import { Hero } from './components/sections/Hero'
import { Pillars } from './components/sections/Pillars'
import { Projects } from './components/sections/Projects'
import { Team } from './components/sections/Team'
import { LeaderPage } from './pages/LeaderPage'

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
        <Ctf />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}

export default function App() {
  if (currentPathname() === leader.path) {
    return <LeaderPage />
  }
  return <Home />
}
