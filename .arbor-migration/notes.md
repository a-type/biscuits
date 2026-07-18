# Web Project Color Mapping

## Components

Do not convert non-class styling - like Box component props.

Prefer using a component-based layout like Box to using custom CSS.

Many components, including Box, can use a Base-UI style `render` composition to augment styles of other components:

```tsx
<Box gap="md" align="start" col render={<OtherComponent />}>
```

## Legacy Utility Classes → Arbor Tokens

### Mixin syntax

This is how mixins are applied:

```css
.selector {
	@apply --mx-mixin-name(var(--m-token-name));
}
```

Tokens and other values are passed directly as positional parameters.

### Utility classes which still work

Some utility classes are retained and still work. These don't need to be converted.

- `flex`/`flex-row`/`flex-col`/`flex-wrap`/`flex-nowrap`
- `items-start`/`items-end`/`items-center`/`items-stretch`
- `justify-start`/`justify-end`/`justify-center`/`justify-between`/`justify-around`/`justify-evenly`
- `w-full`/`w-auto`/`h-full`/`h-auto`
- `overflow-auto`/`overflow-visible`/`overflow-hidden`/`overflow-y-auto`/`overflow-y-visible`/`overflow-y-hidden`
- `gap-none`/`gap-xs`/`gap-sm`/`gap-md`/`gap-lg`/`gap-xl`
- `p-none`/`p-xs`/`p-sm`/`p-md`/`p-lg`/`p-xl`

### For <4 non-theme token styles, `style` is fine

If there are 3 or less styles which don't use token references, just inline them to `style`, it's alright.

### Color utilities (UnoCSS/Tailwind-like)

These were using a custom color system with `color-*` and `bg-*` utilities.

| Legacy class         | Arbor equivalent                                               | Notes                                                                    |
| -------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `color-primary-ink`  | `color: var(--m-tint-ink)`                                     | The web app uses `mainColor: 'lemon'` in arbor.config, so "main" = lemon |
| `color-primary-dark` | `color: var(--m-tint-heavy)`                                   | "dark" maps to "heavy" shade                                             |
| `color-primary-wash` | bg with `var(--m-tint-wash)`                                   | Very faint accent background                                             |
| `bg-primary-wash`    | `@apply --mx-bg` with `var(--m-tint-wash)`                     |                                                                          |
| `bg-white`           | `background: white` or surface token                           | Literal white, use `--m-surface-primary-bg` if contextual                |
| `color-black`        | `color: var(--m-gray-ink)`                                     | Neutral ink is nearly black                                              |
| `color-gray-dark`    | `color: var(--m-gray-heavy)`                                   |                                                                          |
| `color-gray-ink`     | `color: var(--m-gray-ink)`                                     |                                                                          |
| `bg-darken-2`        | Not directly mappable; use `@apply --mx-bg-heavier(--step: 2)` | Only works if bg was set with --mx-bg                                    |
| `color-darken-1`     | Not directly mappable; use `@apply --mx-fg-heavier(--step: 1)` | Only works if fg was set with --mx-fg                                    |

## Layout utilities

Simple layout utilities (`flex`, `grid`, `gap-*`, `p-*`, etc.) are converted to standard CSS in `.module.css` files with no Arbor tokens needed.

## Typography utilities

| Legacy class                      | Arbor equivalent                                                                                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `font-fancy`                      | `font-family: Henrietta, 'Noto Serif', serif` literal — no Arbor token exists for display font, use literal or the `.font-fancy` global class from main.css |
| `font-semibold` / `font-bold`     | `font-weight: var(--m-fw-bold)`                                                                                                                             |
| `font-300` / `font-light`         | `font-weight: 300` (or `var(--m-fw-light)` if token exists)                                                                                                 |
| `text-sm` / `text-xs` / `text-lg` | `font-size: var(--m-fs-sm)` etc.                                                                                                                            |

## Opacity utilities

| Legacy class        | CSS equivalent            |
| ------------------- | ------------------------- |
| `opacity-50`        | `opacity: 0.5`            |
| `hover:opacity-100` | `&:hover { opacity: 1; }` |
