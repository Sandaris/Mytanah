import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Plays shadcn-style enter animation when the block scrolls into view.
 * Respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  once = true,
  as: Component = 'div',
  ...props
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  return (
    <Component
      ref={ref}
      className={cn(
        visible
          ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both'
          : 'opacity-0 translate-y-5',
        className,
      )}
      style={visible && delay ? { animationDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </Component>
  )
}
