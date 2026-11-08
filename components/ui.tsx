import type { ReactNode } from "react";
import { BRAND_META } from "@/lib/brand-meta";

/* ───────────── Layout ───────────── */

type ContainerSize = "default" | "narrow" | "text";
const CONTAINER: Record<ContainerSize, string> = {
  default: "max-w-[1240px]",
  narrow: "max-w-[1040px]",
  text: "max-w-[760px]",
};

export function Container({
  size = "default",
  className = "",
  children,
}: Readonly<{
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
}>) {
  return <div className={`mx-auto w-full px-6 ${CONTAINER[size]} ${className}`}>{children}</div>;
}

export function Section({ id, className = "", children }: Readonly<{ id?: string; className?: string; children: ReactNode }>) {
  return (
    <section id={id} className={`cv-auto pt-[120px] sm:pt-[168px] ${className}`}>
      {children}
    </section>
  );
}

/* ───────────── Type ───────────── */

export function Eyebrow({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return <p className={`text-[15px] text-subtle ${className}`}>{children}</p>;
}

/** Two-tone display headline: first line ink, second line faint grey. */
export function Display({
  first,
  second,
  as: Tag = "h2",
  size = "display",
  className = "",
}: Readonly<{
  first: ReactNode;
  second?: ReactNode;
  as?: "h1" | "h2";
  size?: "display" | "cta" | "split";
  className?: string;
}>) {
  const sizes = {
    display: "text-[clamp(36px,4.8vw,64px)] leading-[1.12] tracking-[-0.035em]",
    split: "text-[clamp(34px,4.2vw,56px)] leading-[1.14] tracking-[-0.035em]",
    cta: "text-[clamp(34px,5.8vw,80px)] leading-[1.1] tracking-[-0.04em]",
  } as const;
  return (
    <Tag className={`font-semibold text-balance text-ink ${sizes[size]} ${className}`}>
      {first}
      {second ? (
        <>
          <br />
          <span className="text-faint">{second}</span>
        </>
      ) : null}
    </Tag>
  );
}

export function Lead({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return <p className={`text-[18px] leading-[1.55] text-muted text-pretty ${className}`}>{children}</p>;
}

/* ───────────── Brand icon + tiles ───────────── */

/** True for colours too dark to read on a dark background (relative luminance < 0.06). */
export function isVeryDark(hex: string): boolean {
  const n = Number.parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.06;
}

export function BrandIcon({
  slug,
  size = 18,
  color,
  className = "",
}: Readonly<{
  slug: string;
  size?: number;
  color?: string;
  className?: string;
}>) {
  const brand = BRAND_META[slug];
  if (!brand) return null;
  // Near-black brand marks (Next.js, GitHub, Kafka…) follow the text colour so they stay visible in dark mode.
  const fill = color ?? (isVeryDark(brand.hex) ? "currentColor" : `#${brand.hex}`);
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill}
      className={`shrink-0 ${className}`}
      role="img"
      aria-label={brand.title}
    >
      <use href={`#si-${slug}`} />
    </svg>
  );
}

/** Coloured rounded square holding a white (or ink) brand glyph. */
export function BrandSquare({
  slug,
  size = 38,
  radius = 11,
  bg,
  fg = "#fff",
  className = "",
}: Readonly<{
  slug: string;
  size?: number;
  radius?: number;
  bg?: string;
  fg?: string;
  className?: string;
}>) {
  const brand = BRAND_META[slug];
  return (
    <span
      className={`flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size, borderRadius: radius, background: bg ?? `#${brand?.hex ?? "111"}` }}
    >
      <BrandIcon slug={slug} size={Math.round(size * 0.47)} color={fg} />
    </span>
  );
}

/** em-sized rotated icon tile used inline inside headlines. */
export function InlineTile({
  bg,
  rotate = -6,
  children,
}: Readonly<{
  bg: string;
  rotate?: number;
  children: ReactNode;
}>) {
  return (
    <span
      aria-hidden="true"
      className="relative top-[-0.06em] mx-[0.06em] inline-flex size-[0.8em] items-center justify-center rounded-[0.22em] align-middle [&>svg]:size-[0.44em]"
      style={{ background: bg, transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

/* ───────────── Buttons & chips ───────────── */

type ButtonVariant = "primary" | "chip" | "outline";
type ButtonSize = "xl" | "md" | "sm";

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-ink-2",
  chip: "bg-chip text-ink hover:bg-line-soft",
  outline: "bg-white text-ink shadow-[0_0_0_1px_var(--color-line-strong)] hover:bg-surface-2",
};
const BTN_SIZE: Record<ButtonSize, string> = {
  xl: "h-[52px] px-[26px] text-[16px] gap-[9px]",
  md: "h-11 px-5 text-[15px] gap-2",
  sm: "h-9 px-4 text-[14px] gap-2",
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "xl",
  icon,
  children,
  className = "",
  external,
  download,
}: Readonly<{
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  external?: boolean;
  download?: boolean;
}>) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
      className={`inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors active:scale-[.98] ${BTN_VARIANT[variant]} ${BTN_SIZE[size]} ${className}`}
    >
      {icon}
      {children}
    </a>
  );
}

export function Chip({ children, icon }: Readonly<{ children: ReactNode; icon?: ReactNode }>) {
  return (
    <span className="inline-flex h-10 items-center gap-2 rounded-full bg-surface-2 px-4 text-[14px] font-medium text-ink">
      {icon}
      {children}
    </span>
  );
}

export function Tag({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line-strong)]">
      {children}
    </span>
  );
}

export function PulseDot({ color = "#63d94e", size = 7 }: Readonly<{ color?: string; size?: number }>) {
  return (
    <span
      aria-hidden="true"
      className="ring-pulse inline-block shrink-0 rounded-full"
      style={
        {
          width: size,
          height: size,
          background: color,
          color: `${color}88`,
          "--ring-scale": "2.8",
          "--ring-duration": "2s",
        } as React.CSSProperties
      }
    />
  );
}

/** Grey rounded "stage" panel that holds every graphic. */
export function Stage({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return <div className={`rounded-[28px] bg-surface-2 ${className}`}>{children}</div>;
}
