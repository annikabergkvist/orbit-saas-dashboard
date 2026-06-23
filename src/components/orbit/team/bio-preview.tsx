"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const bioTextClassName =
  "w-full min-w-0 overflow-hidden text-[13px] leading-[1.4] tracking-[-0.01em] text-foreground/90"

const BIO_CLAMP_CLASS = "max-h-[2.8em]"
const BIO_MIN_HEIGHT_CLASS = "min-h-[2.8em]"
const ROW_2_EXTRA_CHARS = 2

function trimForDisplay(text: string) {
  return text.trimEnd()
}

function setProbePlainText(probe: HTMLParagraphElement, text: string) {
  probe.textContent = text
}

function getLineHeight(probe: HTMLParagraphElement) {
  return parseFloat(getComputedStyle(probe).lineHeight) || 18.2
}

function measureNaturalHeight(probe: HTMLParagraphElement, text: string) {
  const previousMaxHeight = probe.style.maxHeight
  const previousOverflow = probe.style.overflow
  probe.style.maxHeight = "none"
  probe.style.overflow = "visible"
  setProbePlainText(probe, text)
  const height = probe.scrollHeight
  probe.style.maxHeight = previousMaxHeight
  probe.style.overflow = previousOverflow
  return height
}

function getCharCountOnLastLine(probe: HTMLParagraphElement, text: string) {
  setProbePlainText(probe, text)
  const node = probe.firstChild
  if (!node || node.nodeType !== Node.TEXT_NODE || text.length === 0) return 0

  const range = document.createRange()
  let previousTop = -1
  let lastLineStart = 0

  for (let i = 0; i < text.length; i++) {
    range.setStart(node, i)
    range.setEnd(node, i + 1)
    const rect = range.getBoundingClientRect()
    if (previousTop >= 0 && rect.top > previousTop + 1) {
      lastLineStart = i
    }
    previousTop = rect.top
  }

  if (lastLineStart === 0) return 0
  return text.length - lastLineStart
}

function getCharsPerLine(probe: HTMLParagraphElement, trimmedBio: string) {
  for (let i = 2; i <= trimmedBio.length; i++) {
    const row2 = getCharCountOnLastLine(probe, trimmedBio.slice(0, i))
    if (row2 > 0) {
      return i - row2
    }
  }
  return trimmedBio.length
}

function getTargetRow2Chars(probe: HTMLParagraphElement, trimmedBio: string) {
  const charsPerLine = getCharsPerLine(probe, trimmedBio)
  const middle = Math.max(1, Math.floor(charsPerLine / 2))
  return Math.min(charsPerLine - 1, middle + ROW_2_EXTRA_CHARS)
}

function needsTruncation(
  probe: HTMLParagraphElement,
  trimmedBio: string,
  suffixFits: (text: string) => boolean
) {
  setProbePlainText(probe, trimmedBio)
  const targetRow2 = getTargetRow2Chars(probe, trimmedBio)

  if (getCharCountOnLastLine(probe, trimmedBio) > targetRow2) return true

  const lineHeight = getLineHeight(probe)
  if (measureNaturalHeight(probe, trimmedBio) > lineHeight + 1) return true

  return !suffixFits(trimmedBio)
}

function computeClampedBio(
  probe: HTMLParagraphElement,
  trimmedBio: string,
  suffixFits: (text: string) => boolean
) {
  const targetRow2 = getTargetRow2Chars(probe, trimmedBio)
  let end = 0
  let row2AtEnd = 0

  for (let i = 1; i <= trimmedBio.length; i++) {
    const slice = trimmedBio.slice(0, i)
    const display = trimForDisplay(slice)
    const row2 = getCharCountOnLastLine(probe, display)

    if (row2 > targetRow2) break
    if (!suffixFits(slice)) break

    end = i
    row2AtEnd = row2

    if (row2 >= targetRow2) break
  }

  if (end > 0 && row2AtEnd >= 1) {
    return trimForDisplay(trimmedBio.slice(0, end))
  }

  let low = 0
  let high = trimmedBio.length

  while (low < high) {
    const mid = Math.ceil((low + high) / 2)
    if (suffixFits(trimmedBio.slice(0, mid))) {
      low = mid
    } else {
      high = mid - 1
    }
  }

  end = low
  while (end > 0) {
    const display = trimForDisplay(trimmedBio.slice(0, end))
    if (getCharCountOnLastLine(probe, display) <= targetRow2) break
    end--
  }

  return trimForDisplay(trimmedBio.slice(0, end))
}

export function BioPreview({
  bio,
  onReadMore,
  className,
}: {
  bio: string
  onReadMore: () => void
  className?: string
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [truncated, setTruncated] = React.useState(false)
  const [visibleBio, setVisibleBio] = React.useState(bio)

  const measure = React.useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const probe = container.querySelector("[data-bio-probe]") as HTMLParagraphElement | null
    if (!probe) return

    const trimmedBio = bio.trim()
    if (!trimmedBio) {
      setTruncated(false)
      setVisibleBio("")
      return
    }

    const fillProbe = (text: string) => {
      probe.replaceChildren()
      probe.append(document.createTextNode(`${text} ... `))
      const readMore = document.createElement("span")
      readMore.textContent = "read more"
      probe.append(readMore)
    }

    const suffixFits = (text: string) => {
      fillProbe(trimForDisplay(text))
      return probe.scrollHeight <= probe.clientHeight + 1
    }

    if (!needsTruncation(probe, trimmedBio, suffixFits)) {
      setTruncated(false)
      setVisibleBio(trimmedBio)
      return
    }

    setTruncated(true)
    setVisibleBio(computeClampedBio(probe, trimmedBio, suffixFits))
  }, [bio])

  React.useLayoutEffect(() => {
    measure()
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(measure)
    observer.observe(container)

    const frame = requestAnimationFrame(measure)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [measure])

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full min-w-0", BIO_MIN_HEIGHT_CLASS, className)}
    >
      <p
        aria-hidden
        data-bio-probe
        className={cn(
          bioTextClassName,
          BIO_CLAMP_CLASS,
          "pointer-events-none invisible absolute inset-x-0 top-0 -z-10 w-full"
        )}
      />
      <p className={cn(bioTextClassName, BIO_CLAMP_CLASS)}>
        {truncated ? (
          <>
            {visibleBio}
            <span aria-hidden className="text-foreground/90">
              {" "}
              ...
            </span>{" "}
            <button
              type="button"
              className="inline text-muted-foreground transition-colors duration-200 hover:text-foreground/85"
              onClick={(e) => {
                e.stopPropagation()
                onReadMore()
              }}
            >
              read more
            </button>
          </>
        ) : (
          visibleBio
        )}
      </p>
    </div>
  )
}
