import type { Achievement } from '@/data/types'

/** Competition credit is not a change to the site's general crew roster. */
export function AchievementParticipants({
  event,
  participants,
}: Pick<Achievement, 'event' | 'participants'>) {
  if (!participants?.length) return null

  return (
    <div className="mt-4 text-sm text-fg-muted">
      <p className="font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
        Event lineup
      </p>
      <ul aria-label={`${event} team lineup`} className="mt-2 space-y-1">
        {participants.map((participant) => (
          <li key={participant.name}>
            <span className="font-medium text-fg">{participant.name}</span>
            {participant.role ? ` — ${participant.role}` : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
