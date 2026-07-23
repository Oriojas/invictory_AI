---
name: Corporate Innovation Framework
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#414751'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#727782'
  outline-variant: '#c1c6d3'
  surface-tint: '#125faa'
  primary: '#00427b'
  on-primary: '#ffffff'
  primary-container: '#0059a3'
  on-primary-container: '#b4d1ff'
  inverse-primary: '#a5c8ff'
  secondary: '#725c00'
  on-secondary: '#ffffff'
  secondary-container: '#fdd000'
  on-secondary-container: '#6e5900'
  tertiary: '#890006'
  on-tertiary: '#ffffff'
  tertiary-container: '#b5000b'
  on-tertiary-container: '#ffc0b8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a5c8ff'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#004785'
  secondary-fixed: '#ffe07d'
  secondary-fixed-dim: '#edc200'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#564500'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4aa'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#930007'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
  surface-off-white: '#F8F7F2'
  ink-rich: '#111827'
  action-blue: '#0059A3'
  accent-yellow: '#FDD000'
  alert-red: '#E30613'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

This design system is built upon a **Corporate / Modern** aesthetic, emphasizing clarity, structural integrity, and professional dynamism. It targets an audience of entrepreneurs, corporate partners, and innovators who require a platform that feels both established and forward-thinking.

The visual language balances the reliability of institutional blue with the energetic spark of secondary accents. The interface utilizes generous whitespace, crisp structural alignment, and high-quality typography to evoke a sense of organized creativity and "serious play." The emotional response should be one of confidence, accessibility, and momentum.

## Colors

The palette is driven by a deep, authoritative **Action Blue** that serves as the primary anchor for navigation and primary actions. To prevent a purely traditional corporate feel, **Accent Yellow** is used strategically for high-visibility highlights and secondary triggers, while **Alert Red** (adapted from the brand's secondary palette) provides a classic secondary punch for urgency or brand-specific distinction.

The background uses a slightly warm **Surface Off-White** to reduce eye strain and provide a more premium, paper-like feel compared to pure white. Neutral tones are pulled from a deep charcoal (**Ink Rich**) rather than true black to maintain softness in text-heavy environments.

## Typography

The typographic system utilizes **Manrope** for all primary communication. Its geometric yet humanist characteristics provide a modern, balanced, and highly legible experience across both headlines and body copy. 

For technical data, metadata, and specialized labels, **Geist** (mono-variant inspired) is introduced to provide a subtle "innovator" or "tech-forward" edge. This contrast between the friendly Manrope and the precise Geist signals the intersection of human collaboration and technical innovation. High-level displays use heavy weights and negative letter spacing to create a commanding presence.

## Layout & Spacing

The design system employs a **Fixed Grid** on desktop (max-width 1280px) and a **Fluid Grid** on mobile devices. The rhythm is based on a 4px baseline, with a standard 12-column layout for desktop and a 4-column layout for mobile.

Spacing is designed to be intentional and ample. We use "air" to separate logical sections rather than lines where possible. Gutters are kept wide at 24px to ensure content breathability. On mobile, margins shrink to 20px to maximize real estate while maintaining a safe "touch-free" zone at the edges.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Low-Contrast Outlines**. Instead of heavy shadows, this design system uses subtle shifts in background color (e.g., placing a white card on a Surface Off-White background) and thin 1px borders in a muted neutral shade.

Where elevation is required for interactivity (like hover states on cards), a very soft, diffused ambient shadow is used with a slight blue tint (`rgba(0, 89, 163, 0.08)`) to maintain brand cohesion even in the shadows. This creates a "lifted" effect that feels integrated rather than floating.

## Shapes

The shape language is **Soft** and disciplined. We avoid overly aggressive rounding to maintain a professional corporate posture. A standard radius of 0.25rem (4px) is used for small components like inputs and checkboxes, while larger containers like cards or feature blocks may scale up to 0.5rem (8px). Buttons may use slightly more rounding (0.5rem) to signify their interactive and approachable nature, but they never reach a full pill shape.

## Components

- **Buttons**: Primary buttons are solid Action Blue with white text. Secondary buttons use a transparent background with an Action Blue border. For high-energy calls to action, use Accent Yellow with Ink Rich text.
- **Cards**: Cards use a pure white background with a 1px border of 10% opacity Ink Rich. On hover, the border darkens slightly and a soft tinted shadow is applied.
- **Input Fields**: Inputs feature a 4px border radius and a Surface Off-White background. The focus state is signaled by an Action Blue 2px stroke.
- **Chips**: Use the Geist font in all-caps (label-sm). Backgrounds should be low-saturation versions of the brand colors to denote categories without overwhelming the primary content.
- **Lists**: Lists are clean with 1px horizontal dividers. Icons used in lists should be monolinear and geometric to match the Manrope aesthetic.
- **Navigation**: The top navigation bar should be sticky, utilizing a semi-transparent white backdrop with a blur effect to maintain context of the content beneath while ensuring legibility.