import { cn } from '@/lib/utils'

export function SectionHeader({ eyebrow, title, description, className }) {
  return (
    <div className={cn('mb-6', className)}>
      {eyebrow && (
        <p className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#A27B5C] mb-1">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="font-display text-2xl text-[#2C3930]">{title}</h2>
      )}
      {description && (
        <p className="text-sm text-[#5C7065] mt-1">{description}</p>
      )}
    </div>
  )
}
