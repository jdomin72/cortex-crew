/**
 * Join truthy class strings.
 *
 * Deliberately not `clsx` + `tailwind-merge` (~7 KB gzipped): with a seven-piece
 * component kit, the conflict resolution they buy isn't worth the weight. The
 * trade-off is that a `className` prop must not collide with a base class — put
 * overrides last and keep them on different properties.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
