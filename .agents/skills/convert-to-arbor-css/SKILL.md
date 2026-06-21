---
name: convert-to-arbor-css
description: Convert existing CSS solutions to use Arbor CSS methodology.
---

# Convert to Arbor CSS

Arbor CSS is an opinionated CSS design system library which organizes design tokens into layers of CSS properties and allows users to define CSS functions and mixins which align with upcoming CSS feature specs, which are transpiled to widely supported CSS. The goal of this skill is to convert existing CSS solutions to use the Arbor CSS methodology.

This migration will require some consideration of intent and design choices from the user. Whenever there's ambiguity in how to map tokens to a particular UI component or the semantic meaning of something, ask the user for clarification.

## Create a directory to store memory about decisions made during the migration to increase consistency

Users may want to migrate incrementally, so it's important to keep track of decisions made about how to map certain styles or components to Arbor CSS concepts. It can help to create a log of choices made. This can include things like:

- How certain components are mapped to mode tokens
- Any custom mixins or functions created to handle specific styling needs
- Notes on any decisions made about how to handle specific styling patterns or edge cases

Create a directory in the repository called `.arbor-migration` to store this information, and create files within that directory as needed to document the migration process.

Do not just log what was done during mundane conversion or reiterate the rules of this skill. Only record generalized choices which extend beyond the rules listed here, so that these choices can be made consistently across the codebase over the course of a migration. If there's nothing interesting to write down, don't bother.

If this directory already exists, read its contents to inform your decisions and maintain consistency with previous mappings and choices.

## Use the Arbor CLI to discover tokens you can use in styles

The Arbor CLI contains several commands for introspecting the user's token configuration. Use these commands to list tokens or get more details about a particular token.

```
# list all tokens, or filter by layer
arbor tokens:list
arbor tokens:list --filter mode

# get detailed information about a specific token
arbor token:info --m-color-main-ink

# get the base mode's resolved value for a token
arbor token:resolve --m-color-main-ink
```

You can also list available functions and mixins with their parameters and descriptions.

```
# list all functions and mixins
arbor functions:list
arbor mixins:list
```

## Determine the current CSS methodology

First, analyze the code associated with the request to decide how it is styling components. Look for patterns such as:

- Utility-first CSS (e.g., Tailwind)
- Component-based CSS (e.g., CSS Modules, Styled Components)
- Traditional CSS (e.g., global stylesheets)
- Other methodologies (e.g., BEM, Atomic CSS)

## Set up CSS preprocessing, if not already in place

ArborCSS relies on PostCSS to preprocess CSS files and transform future syntax like `@apply` or CSS functions. If the project is not already set up with a CSS preprocessor, configure PostCSS with `@arbor-css/postcss` as a plugin. If the project already has this, you can move on to the next step.

```js
import { ArborPlugin } from '@arbor-css/postcss';

export default {
	plugins: [ArborPlugin()],
};
```

Vite and RSBuild support PostCSS out of the box, so no additional configuration is needed for those. For Webpack, you may need to add `postcss-loader` to your CSS handling rules. Determine any further steps based on the bundler in use.

## Convert non-themed CSS values to CSS modules

Many CSS values are not particular to the design system theme. For example, layout styles like `display: flex` or `position: absolute` are not related to the design system and can be migrated to CSS modules without needing to reference any Arbor tokens. This is a good first step to break down the existing CSS and make it more manageable before mapping styles to Arbor tokens.

When converting to CSS modules, create a new `.module.css` file for each component if one doesn't already exist. Move any non-themed styles into this CSS module file, and update the component to import the CSS module and apply the styles using the generated class names.

## Map themed styles to Arbor CSS layers

The main focus will be using mode tokens for proper semantic styling. Prefer intent tokens first if the component aligns with an intent; otherwise use semantic values. Avoid referencing non-semantic colors via the `palette` namespace; in most cases an appropriate `@mode-<color>` class should be applied instead to switch `color-main` to the right color.

Arbor CSS organizes design tokens into modes with layers of tokens:

### Intent tokens

The mode includes grouped tokens called "intents": 'action', 'control', 'surface', and 'text'. These represent broad categories of UI elements and their semantic intent.

Some token examples: `--m-action-primary-bg`, `--m-surface-ambient-fg`, `--m-action-radius`, `--m-control-bg`, `--m-text-secondary-size`. See the CLI `arbor tokens:list --filter intent` for a full list of available intent tokens.

### Semantic tokens

Basic design tokens like colors, spacing, typography, are mapped under appropriate token namespaces, if an intent doesn't align with the need. These values are relative to the configuration of the active mode; for example, `--m-color-main` takes on the "main" color of a mode like `@mode-accent` or `@mode-success`, and `--m-spacing-md` gets larger in `@mode-hero` and smaller in `@mode-dense`. Thus proper usage depends on the applied modes on the component. Don't think in absolute terms; use tokens with semantic relationship to the local component; "medium" spacing is medium relative to the component itself, not a global range.

Some token examples: `--m-color-main-light`, `--m-color-neutral-ink`, `--m-spacing-lg`, `--m-radius-sm`, `--m-typography-size-lg`, `--m-typography-weight-bold`, `--m-lineWidth`. See the CLI `arbor tokens:list` for a full list of available mode tokens and use `--filter color`, `--filter spacing`, etc. to find specific types of tokens. Semantic categories include: color, spacing, radius, typography, shadow, duration, easing, and lineWidth.

### Referencing other colors

Each mode has a `main` color. Assume that the applied color is the intended color for the component. This includes components with inherent semantic meaning; assume that if the component is a "success check icon" it is already receiving "@mode-success" as a configured mode class, for example, and use the `main` color with that assumption.

However, if you need to reference a second color besides `main`, the `--m-color-palette-<name>` token namespaces are available for use. This includes a named group for every color in the theme.

### Mapping variants to modes

The Arbor concept of "mode" is a fundamental system which covers much of the functionality traditionally implemented as individual variants of components. For example, instead of having separate "primary", "secondary", "danger" variants for a button, you would have a single button component that uses mode tokens to adapt its styling based on the active color context (e.g., "accent", "error", "success"). The same goes for size variants: modes can control the size of spacing and typography, so components can just reference those mode tokens instead of having separate size variants.

However, not all variations are modes. Emphasis and semantic intent is still controlled by the component. For example, it's appropriate to have a "primary", "secondary", and "ghost" (or "ambient" in Arbor's default terminology) variant for buttons. These align with the structure of the mode itself. Arbor's built-in preset mode includes semantic intents for actions (primary, secondary, ambient), surfaces (primary, secondary, ambient), and text (primary, secondary, ambient). So these variants can be retained as they align with the mode structure, but the styling within those variants should reference the appropriate mode tokens for their intent.

Some judgment is required here to determine which semantic meaning aligns with a component. Arbor's semantic names for tokens are purposefully broad and meant to represent concepts, not specific elements: "action", "control", "surface". If it's unclear what makes the most sense for a component, ask the user for clarification. Here's a general idea of each:

- Surface: containers, cards, sheets, modals, popovers - any box which visually wraps content. Surface tokens provide a border option, but surfaces are not always bordered. They do often use a background and foreground color. Common examples: cards, modals, popovers.
- Action: interactive elements which trigger something. Actions are meant to stand out from text and usually incorporate color, at least at primary emphasis. Common examples; buttons, links, badges, tags.
- Control: Data entry elements. Control does not include emphasis levels; uniformity is important to a user's expectations around data entry. Common examples: text fields, checkboxes, radio buttons, selects, sliders, etc.

### Utilizing appropriate color and system mixins

Arbor has built-in mixins for applying certain CSS properties that enhance traditional CSS with more flexibility. These mixins don't just apply the direct CSS property like `color`; they first assign the input value to an intermediate token. Other mixins can reference this token for cross-property logic (like computing a contrasting foreground color for the active background), and mixins can also dynamically adjust the final color before it's applied to the real CSS property (see next subsection for examples of that).

Here are the mixins to use instead of directly applying CSS properties:

| CSS Property     | Mixin                     | Notes                                             |
| ---------------- | ------------------------- | ------------------------------------------------- |
| color            | `@apply --mx-fg`          |                                                   |
| background-color | `@apply --mx-bg`          |                                                   |
| border-color     | `@apply --mx-borderColor` | Also sets a default border-style and border-width |
| fill             | `@apply --mx-fill`        | For SVG elements                                  |
| stroke           | `@apply --mx-stroke`      | For SVG elements                                  |

### Handling input states

Arbor does not use specific, named tokens for input states like "hover", "active", "disabled". Instead it leverages mixins to adjust the base styling for the component according to rules.

The preset in use defines named mixins which apply default styling for each element state:

- `@apply --mx-hover` - Lightens the background color and draws a ring around the element matching its background color
- `@apply --mx-focus` - Darkens the background color and draws a ring around the element matching its background color
- `@apply --mx-active` - Darkens the background color more significantly and draws a ring around the element matching its background color
- `@apply --mx-disabled` - Desaturates the background and foreground colors and reduces their contrast against each other

Other more granular mixins are also available to alter colors based on states, if the default adjustments aren't sufficient. These include:

- `@apply --mx-[bg/fg/border]-lighter(--steps)` / `@apply --mx-[bg/fg/border]-heavier(--steps)` - Lightens or darkens the background, foreground, or border color by a certain number of steps. Good for hover, focus, and other interactive states.
- `@apply --mx-[bg/fg/border]-saturated(--steps)` / `@apply --mx-[bg/fg/border]-desaturated(--steps)` - Increases or decreases the saturation of the color. Can be used for disabled states to desaturate colors, or to saturate colors for interactive states.
- `@apply --mx-[bg/fg/border]-faded(--alphaValue)` - Adjusts the alpha transparency of the color. Can be used for disabled states to make colors more transparent, or for hover states to add a subtle overlay effect.

Those mixins automatically utilize the appropriate color's initial value to perform the adjustment. This only works if a color mixin was used to apply that color originally (see: previous subsection). If the color was applied directly using a primitive token or a literal value, the mixins won't have the correct reference point to perform the adjustment and will not work as intended.

## Refactor CSS to use Arbor CSS

Given the mappings and understanding from steps 1 and 2, refactor the existing CSS to utilize Arbor CSS methodology. Unless the user is already utilizing a CSS preprocessor like Sass or Less, use CSS Modules to encapsulate styles for each component.

If the user's CSS utilizes direct color or spacing values, attempt to map those to appropriate semantic mode tokens. If there is ambiguity in which token to use, ask the user for clarification on the intent of the styling so you can determine the best mapping. When a mapping decision is made, store the result of that decision in the `.arbor-migration` directory for future reference to maintain consistency across the migration.

When refactoring, ensure that you are using the appropriate mixins for applying colors and handling states as described in step 3.2. and 3.3. This will ensure that the components can take full advantage of the flexibility and features of Arbor CSS.

### Rules to follow during conversion

1. Always prefer using mode tokens over primitive tokens or literal values for styling components. Only use primitive tokens if there is no clear semantic mode token to use. Rarely, if ever, use literal values like "1em" or "#fff" - tokens are important.
2. Look for other files in the codebase which are already using Arbor CSS tokens for guidance on how to map certain styles to tokens. Check the `.arbor-migration` directory for any notes on previous mapping decisions. You can find files using Arbor tokens by searching for token prefixes in CSS files, like `--m-` or `--mx-`.
3. When in doubt about how to map a certain style to a token, ask the user.

## Creating new mixins or functions

If you find a repeating pattern of customized properties or complex CSS logic (`calc`, etc) which is repeatable across multiple components, consider creating a custom mixin or function in the Arbor system to handle that pattern. This can help to keep the CSS clean and maintainable, and also allows you to leverage the dynamic capabilities of mixins and functions for more complex styling needs.

When creating a new mixin or function, ensure that it follows the conventions of Arbor CSS and is well-documented for future reference. Also, consider whether the functionality you're implementing could be useful for other components or if it has broader applicability, as this can help to justify its inclusion in the system.

Follow patterns present in any existing user mixins and functions (these will be passed to the user's Arbor preset configuration in their `arbor.config.ts` file).

## Validate the resulting CSS

Use the Arbor CLI to validate any CSS files you write or edit. You can pass the file path to `npx arbor validate` as a parameter, and it will check that all tokens are valid and suggest similar names for invalid tokens.
