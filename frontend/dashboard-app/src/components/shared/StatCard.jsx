import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const trendStyles = {
  up: 'text-[#2D7A4F] bg-[#2D7A4F]/10',
  down: 'text-[#A63228] bg-[#A63228]/10',
  stable: 'text-[#8B6914] bg-[#8B6914]/10',
}

export function StatCard({ label, value, sub, trend, accent, className }) {
  return (
    <Card
      className={cn(
        'hover:shadow-md transition-shadow',
        accent && 'border-l-4',
        className
      )}
      style={accent ? { borderLeftColor: accent } : undefined}
    >
      <CardContent className="p-4">
        {label && (
          <p className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#A27B5C] mb-2">
            {label}
          </p>
        )}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-2xl font-medium text-[#2C3930] leading-none">
              {value}
            </p>
            {sub && (
              <p className="text-xs text-[#5C7065] mt-0.5">{sub}</p>
            )}
          </div>
          {trend && (
            <span
              className={cn(
                'shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                trendStyles[trend.dir] ?? trendStyles.stable
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
