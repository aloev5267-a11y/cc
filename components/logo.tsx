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
 * Марка — блочная буква «E» глубокого синего (navy) и две восходящие «стрелки»-штриха
 * фирменного синего (динамика, карьерный рост). Вместе читается как монограмма «ElWork».
 * Вордмарк двухцветный: «El» — базовый цвет текста, «Work» — фирменный синий.
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

/**
 * Только марка (без текста) — для favicon-подобных мест, аватаров, копирайта.
 * `withBackdrop` рисует скруглённую подложку (для favicon / тёмных фонов).
 */
export function LogoMark({
  size = 36,
  className,
  withBackdrop = false,
}: {
  size?: number
  className?: string
  withBackdrop?: boolean
}) {
  // Уникальные id градиентов на случай нескольких марок на странице.
  const uid = `lw-${size}-${withBackdrop ? "b" : "n"}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label={siteConfig.name}
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={`${uid}-blue`} x1="26" y1="42" x2="48" y2="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1f6bff" />
          <stop offset="1" stopColor="#4f9bff" />
        </linearGradient>
      </defs>

      {withBackdrop && <rect width="48" height="48" rx="13" fill="#0f2f63" />}

      {/* Блочная «E» — фирменный navy (на подложке — белая для контраста) */}
      <path
        d="M5 8 H25 V15 H13 V20.5 H23 V27 H13 V33 H25 V40 H5 Z"
        fill={withBackdrop ? "#ffffff" : "#0f2f63"}
      />

      {/* Восходящие штрихи-стрелки — динамика и рост */}
      <path
        d="M26 40 L40 9"
        stroke="#5aa2ff"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M33 40 L46 9"
        stroke={`url(#${uid}-blue)`}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
