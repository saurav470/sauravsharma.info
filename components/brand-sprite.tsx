import { allBrandSlugs, getBrand } from "@/lib/brands";

/** One hidden SVG sprite with every brand glyph; icons reference it via <use>. Server-only. */
export function BrandSprite() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        {allBrandSlugs().map((slug) => (
          <symbol key={slug} id={`si-${slug}`} viewBox="0 0 24 24">
            <path d={getBrand(slug)?.path} />
          </symbol>
        ))}
      </defs>
    </svg>
  );
}
