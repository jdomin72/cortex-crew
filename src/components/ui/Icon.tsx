import type { SVGProps } from 'react'

/* A hand-rolled sprite replacing lucide-react entirely (~2 KB vs ~14 KB gzipped
   for the tree-shaken import). All glyphs are drawn on a 24x24 grid and stroked,
   so they share weight and optical size. */

export type IconName =
  | 'hex'
  | 'trophy'
  | 'medal'
  | 'flag'
  | 'terminal'
  | 'code'
  | 'shield'
  | 'calendar'
  | 'pin'
  | 'external'
  | 'arrow-right'
  | 'facebook'
  | 'github'
  | 'linkedin'
  | 'telegram'
  | 'mail'
  | 'globe'
  | 'menu'
  | 'close'

/* Stroked glyphs — inherit currentColor, share stroke-width. */
const STROKE: Partial<Record<IconName, string>> = {
  hex: 'M12 2.6 20.5 7.3v9.4L12 21.4 3.5 16.7V7.3Z',
  trophy: 'M7 4h10v5a5 5 0 0 1-10 0Z M7 5H4v2a3 3 0 0 0 3 3 M17 5h3v2a3 3 0 0 1-3 3 M12 14v4 M9 21h6 M10 21a2 2 0 0 1 4 0',
  medal: 'M8 3 12 9l4-6 M12 9a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z M12 13.5l1 2 2 .2-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9.5 15.7l2-.2Z',
  flag: 'M5 21V4 M5 4h11l-2 3.5L16 11H5',
  terminal: 'M4 5h16v14H4Z M7.5 9.5 10 12l-2.5 2.5 M13 15h4',
  code: 'M4 5h16v14H4Z M9 10 7 12l2 2 M15 10l2 2-2 2',
  shield: 'M12 3 5 5.8v5.5c0 4.2 2.9 7.6 7 8.7 4.1-1.1 7-4.5 7-8.7V5.8Z M9.3 12.2l1.9 1.9 3.6-3.9',
  calendar: 'M4 6h16v14H4Z M4 10h16 M8.5 3.5v3 M15.5 3.5v3',
  pin: 'M12 21s6.5-6.1 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 14.9 12 21 12 21Z M12 12.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z',
  external: 'M14 4h6v6 M20 4l-8.5 8.5 M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  'arrow-right': 'M4 12h15 M13 6l6 6-6 6',
  mail: 'M3 6h18v12H3Z M3 7l9 6 9-6',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M3.5 9.5h17 M3.5 14.5h17 M12 3c2.4 2.4 3.6 5.4 3.6 9S14.4 18.6 12 21 8.4 15.6 8.4 12 9.6 5.4 12 3Z',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  close: 'M6 6l12 12 M18 6 6 18',
}

/* Filled brand marks — official glyph shapes, so they must be paths not strokes. */
const FILL: Partial<Record<IconName, string>> = {
  facebook:
    'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z',
  github:
    'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.32 9.32 0 0 1 5.01 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.59.69.49A10.06 10.06 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z',
  linkedin:
    'M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 13.7c0-3.3-1.76-4.83-4.11-4.83-1.9 0-2.74 1.04-3.22 1.78V8.5H9.73V21h3.38v-6.98c0-1.53.29-3.02 2.19-3.02 1.87 0 1.9 1.75 1.9 3.12V21h3.24v-7.3Z',
  telegram:
    'M21.6 4.3 2.9 11.5c-.9.34-.9 1.62.02 1.93l4.63 1.55 1.79 5.6c.24.75 1.2.95 1.72.36l2.5-2.83 4.7 3.45c.66.48 1.6.13 1.78-.68l3.1-14.5c.2-.9-.7-1.66-1.54-1.35ZM8.6 14.1l9.14-5.62-7.5 6.9-.3 3.2-1.34-4.48Z',
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
  /** Set → the icon is meaningful (role="img" + <title>). Unset → decorative. */
  title?: string
}

export function Icon({ name, size = 16, title, ...rest }: IconProps) {
  const filled = FILL[name]
  const stroked = STROKE[name]
  const labelled = title
    ? { role: 'img' as const, 'aria-label': title }
    : { 'aria-hidden': true as const, focusable: false as const }

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...labelled}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {filled ? (
        <path d={filled} fill="currentColor" />
      ) : (
        <path
          d={stroked}
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}
