import { useEffect, useRef, useState } from 'react'

interface OverflowTooltipTextProps {
  text: string
  className?: string
}

/** Native title только если текст обрезан ellipsis. */
export function OverflowTooltipText({ text, className }: OverflowTooltipTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [tooltip, setTooltip] = useState<string | undefined>(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      setTooltip(el.scrollWidth > el.clientWidth ? text : undefined)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [text])

  return (
    <span ref={ref} className={className} title={tooltip}>
      {text}
    </span>
  )
}
