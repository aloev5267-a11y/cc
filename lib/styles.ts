import { cn } from "@/lib/utils"

// Shared input style classes to reduce duplication
export const inputStyles = {
  // Base input styles
  base: "w-full bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
  
  // Size variants
  sizes: {
    default: "h-12 px-4",
    sm: "h-11 px-4 text-sm",
    lg: "h-14 px-5",
  },
  
  // With icon padding
  withIcon: {
    left: "pl-12",
    right: "pr-12",
    both: "px-12",
  },
  
  // Special variants
  centered: "text-center",
}

// Utility function to compose input classes
export function getInputClass(options?: {
  size?: keyof typeof inputStyles.sizes
  withIcon?: keyof typeof inputStyles.withIcon
  centered?: boolean
  className?: string
}) {
  return cn(
    inputStyles.base,
    inputStyles.sizes[options?.size || "default"],
    options?.withIcon && inputStyles.withIcon[options.withIcon],
    options?.centered && inputStyles.centered,
    options?.className
  )
}

// Label styles
export const labelStyles = "text-sm font-medium text-foreground mb-2 block"
export const labelMutedStyles = "text-sm font-medium text-muted-foreground mb-2 block"

// Button base styles
export const buttonStyles = {
  primary: "w-full bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors",
  secondary: "w-full bg-muted text-foreground font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-muted/80 transition-colors",
  ghost: "bg-transparent hover:bg-muted text-foreground font-medium rounded-xl flex items-center justify-center gap-2 transition-colors",
  
  sizes: {
    sm: "h-10 px-4 text-sm",
    default: "h-12 px-5",
    lg: "h-14 px-6 text-base",
  },
}

// Card styles
export const cardStyles = {
  base: "bg-card rounded-2xl border border-border shadow-lg",
  elevated: "bg-card rounded-2xl border border-border shadow-2xl",
  interactive: "bg-card rounded-2xl border border-border shadow-lg hover:shadow-xl transition-shadow",
}

// Section title styles
export const sectionStyles = {
  badge: "inline-block px-4 py-1.5 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-4",
  title: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-4",
  subtitle: "text-muted-foreground max-w-2xl mx-auto",
}
