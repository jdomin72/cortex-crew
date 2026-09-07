/**
 * Prerender entry — used only by scripts/prerender.ts at build time.
 *
 * Kept separate from main.tsx so the browser bundle never imports
 * react-dom/server.
 */
import App from './App'
import { LeaderPage } from './pages/LeaderPage'

export { App, LeaderPage }
