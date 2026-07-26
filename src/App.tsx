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
import { Timeline } from './components/sections/Timeline'

export default function App() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Pillars />
        <About />
        <Achievements />
        <Timeline />
        <Projects />
        <Team />
        <Ctf />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
