import { cn } from "@/lib/utils"

/**
 * VMware Clarity **slider-line** (sliders / range control), 36×36 outline.
 *
 * Prefer sourcing icons from [shadcn.io/icons](https://www.shadcn.io/icon/clarity-slider-line)
 * when listed there; this path matches Iconify `clarity:slider-line` (same Clarity glyph).
 *
 * @see https://www.shadcn.io/icon/clarity-slider-line
 */
export function ClaritySliderLineIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn(className)}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M12 12.37a4 4 0 0 0-3-3.89V5a1 1 0 1 0-2 0v3.48a4 4 0 0 0 0 7.78V31a1 1 0 1 0 2 0V16.26a4 4 0 0 0 3-3.89m-4 2a2 2 0 1 1 2-2a2 2 0 0 1-2 2.03Z"
      />
      <path
        fill="currentColor"
        d="M32 15.83a4 4 0 0 0-3-3.89V5a1 1 0 1 0-2 0v6.94a4 4 0 0 0 0 7.78V31a1 1 0 1 0 2 0V19.72a4 4 0 0 0 3-3.89m-4 2a2 2 0 1 1 2-2a2 2 0 0 1-2 2.04Z"
      />
      <path
        fill="currentColor"
        d="M22 24.5a4 4 0 0 0-3-3.89V5a1 1 0 1 0-2 0v15.61a4 4 0 0 0 0 7.78V31a1 1 0 1 0 2 0v-2.61a4 4 0 0 0 3-3.89m-4 2a2 2 0 1 1 2-2a2 2 0 0 1-2 2.03Z"
      />
      <path fill="none" d="M0 0h36v36H0z" />
    </svg>
  )
}
