import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

type LogoProps = {
  /** Размер марки в пикселях (квадрат). Вордмарк масштабируется относительно. */
  size?: number
  /** Показывать ли текстовый вордмарк рядом с маркой. */
  showWordmark?: boolean
  /** Класс для текста вордмарка (например, размер шрифта). */
  wordmarkClassName?: string
  className?: string
}

/**
 * Фирменный логотип ElWork.
 * Марка — скруглённый квадрат фирменного синего с белым знаком «стрелка вверх»
 * (символ карьерного роста / трудоустройства). Вордмарк двухцветный: «El» —
 * базовый цвет текста, «Work» — фирменный синий, что держит единый стиль сайта.
 */
export function Logo({ size = 36, showWordmark = true, wordmarkClassName, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {showWordmark && (
        <span
          className={cn(
            "font-extrabold tracking-tight leading-none text-foreground",
            wordmarkClassName ?? "text-lg",
          )}
        >
          {siteConfig.brandPrefix}
          <span className="text-primary">{siteConfig.brandSuffix}</span>
        </span>
      )}
    </span>
  )
}

/** Только марка (без текста) — для favicon-подобных мест, аватаров, копирайта. */
export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label={siteConfig.name}
      className={cn("shrink-0", className)}
    >
      {/* Скруглённый квадрат — фирменный синий */}
      <rect width="40" height="40" rx="11" className="fill-primary" />
      {/* Знак: восходящая стрелка/шеврон — карьерный рост */}
      <path
        d="M12 23.5 L20 15.5 L28 23.5"
        stroke="white"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 15.5 L20 27"
        stroke="white"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
    </svg>
  )
}
