---
name: pro-ui-polish
description: Turns a finished website that looks AI-generated, template-made or amateur into one that looks hand-built by a senior front-end engineer and designer. Covers typography, professional fonts, layout, white space, logo and navbar, buttons, drop shadows, color, motion, responsive behavior and front-end code quality, without changing what the site does. Use this skill whenever the user asks to polish, redesign, restyle, clean up, modernize or "make professional" a website or UI, says it looks AI-made, like AI slop, vibe coded, generic, cheap or template-y, or wants it to look premium or sellable, even if they never say "skill" or "polish".
---

# Pro UI Polish

Take a working website and raise it to the standard of a paid, hand-built product. Run this after the site is functionally done. The site should do exactly what it did before, and look like someone with taste and ten years of experience made every decision on purpose.

This file is self-contained and works on any stack.

## Working in Antigravity

- **Plan first.** Put the audit and the design brief in your implementation plan, before any code changes. If the user asked to review the plan, stop there until they approve it.
- **Use the browser.** If browser tools are available, open the running site and capture it at about 375, 768 and 1440px before you edit, then again after. Judge the rendered page, not the code. If you can't open it, say so in the report.
- **Run the project.** Start the dev server from the terminal using the project's own scripts. If a command needs the user's approval, ask rather than working around it.
- **Finish with a walkthrough.** Put the before and after screenshots and the report from the end of this skill in your walkthrough, so the owner can review the work in one place.

## The idea behind everything here

AI-made sites rarely look bad because of one thing. They look AI-made because **every decision was left at its default**: the default palette, the default font with default tracking, the default hero, the default three cards, the same radius and padding on everything. A professional's work differs in one way: each choice has a reason tied to this particular product.

So the goal is not to apply a new style. A new house style is just a new default, and it creates a new fingerprint. For every value you touch, you should be able to answer "why this, for this site?" If the honest answer is "that's what I always use", choose again.

Three consequences:

- **No single tell proves anything.** Stripe uses purple and Linear uses Inter, and both look superb. A measured study of 202 design-led sites found a third use purple and a quarter use Inter or the system stack. The tell is the bundle of defaults with no craft around them. Keep a "tell" when it is deliberate and well executed.
- **Restraint is the look.** The classic professional style is mostly subtraction: fewer colors, fewer effects, fewer borders, fewer font weights, more considered space. When unsure, remove rather than add.
- **But a finished site is not a wireframe.** Subtraction clears the ground; it doesn't finish the job. Every page still needs at least one rich moment: a real photo, a well-framed product view, a strong band of color, a beautifully set table. If the result is all text and hairlines, you stopped halfway. People pay for a site that feels made, not one that feels emptied.

## Hard limits

- **Change the look, never the behavior.** Leave routes, API calls, data flow, form logic, auth, analytics, SEO-relevant URLs and business logic alone. If a visual fix needs a behavior change, list it in your report instead of doing it. Small presentation wiring is fine and expected: pointing a dead `href="#"` at a section that exists on the page, making a phone number a `tel:` link, adding a mobile menu. List these in the report. If a link has no real target, leave it and flag it.
- **Never invent facts.** No fake testimonials, customer logos, user counts, ratings, awards, team members, prices or stats. These are the worst thing an agent can add to a site, because they are false claims made in the owner's name. If a section needs proof that doesn't exist, use a clearly marked placeholder or remove the section, and flag it in the report. An illustrative product mock-up is allowed if it only shows features the site already describes, is labelled as a sample, and implies no results or real customers.
- **Respect existing brand assets.** If the site has a real logo, brand colors or brand fonts, build around them. Replace only what is clearly an unchosen default. To tell the two apart, look for evidence of a brand: a logo file, a style guide, the color used on real signage or packaging, or the owner saying so. Colors that only exist in generated CSS are defaults.
- **Protect the work.** In a git repo, work on a new branch if the user allows it and keep changes reviewable. Avoid adding dependencies unless they earn it (a font package is fine, a UI kit is not).
- **Use only licensed fonts.** Commercial faces like Söhne or Neue Haas Grotesk are fine only if the owner has a licence.

## Workflow

Work in this order. It matters: hierarchy and layout come first, and shadows and details come last, because decoration can't rescue weak structure.

1. **Survey.** Identify the stack (Tailwind v3 or v4, CSS modules, plain CSS, styled-components, shadcn, a CMS theme) and where styles live. Read the main pages and shared components. Work within that stack; don't introduce a second styling system. One exception: a dev-only runtime such as the Tailwind CDN script should be replaced in production, by a real build or by plain CSS, and noted in the report.
2. **Look at it.** Run the site and view it at about 375, 768 and 1440px wide if you can. Screenshots beat reading code, because most of these problems are only visible rendered. If you can't run it, say so in the report.
3. **Audit.** Go through the tells below and write down what you found.
4. **Write a design brief.** Before touching code, write these down: who the site is for, three adjectives for how it should feel, the chosen fonts, the accent color, and the one layout idea that sets this site apart. Derive them from the content, industry and audience. A law firm, a bakery, a developer tool and a mosque's donation page should not end up looking alike.
5. **Build tokens.** Put type, color, spacing, radius, shadow and motion values in one place (see Foundations).
6. **Restructure, then style.** Layout and hierarchy, then typography, then nav and logo, buttons, cards, forms, footer, then shadows and motion.
7. **Clean the code** (see Code craft).
8. **Verify and report** (see the last two sections).

If the site is large, finish the shared system and the home page first, then roll out to other pages, so nothing ends up half-migrated.

## Audit: the tells

Treat these as a checklist of suspects. The first group is the classic AI fingerprint, the second is the newer one. Models have learned to avoid purple, and the "tasteful" replacement is now just as recognizable. Don't swap old tells for new ones.

**Classic fingerprint**
- Indigo or violet primary (`indigo-600`), blue-to-purple gradients, cyan on dark
- Gradient text in headings, colored glows around buttons or cards
- Inter or Roboto with no tracking, no real type scale, everything `font-bold`
- Centered hero, then three identical icon cards, then pricing with an elevated middle tier, then FAQ accordion, then footer
- Same `rounded-2xl shadow-lg p-6` on everything; one radius and one padding for the whole site
- Icon in a tinted rounded square stacked above each card heading
- Emoji used as icons
- Glassmorphism on many surfaces; cards inside cards
- Colored border on just one side of a rounded card
- Fade-up on every element while scrolling, hover `scale(1.05)`, bouncy easing
- Missing hover, focus, active, disabled or loading states
- "Build the future of…", "Your all-in-one platform", "Seamless integration", "Empower", "Unlock", "Get Started" on every button

**Newer fingerprint (2025 to 2026)**
- Warm cream or beige page background chosen as a safe "tasteful" surface (a barely warm near-white is fine; the tell is a page that visibly reads as beige)
- Italic serif hero headline, especially Instrument Serif
- Space Grotesk or Geist chosen by reflex
- Tiny uppercase tracked eyebrow or pill chip above the headline, repeated as a kicker on every section
- "01 / 02 / 03" section numbers on things that aren't a sequence
- Three-stat row with a big number and small label, especially with made-up numbers
- A long full sentence set at display size
- Hairline border combined with a wide soft shadow on the same card
- Sparkle, wand or robot icons; "AI-powered" badges
- Punchy rebuttal copy ("No fluff. Just results."), em dashes everywhere

**Basic quality failures** (these sink a site regardless of who made it)
- Body under 14px, lines over about 80 characters, low contrast, gray text on a colored background
- Text touching the screen edge on mobile, cramped padding, horizontal scroll
- Broken or stretched images, inconsistent aspect ratios
- Lorem ipsum, "Your Company", `href="#"` in visible links, default favicon, "Vite + React" page title

## Foundations

Below are measured or conventional starting values. They are defaults to reason from, and the brief overrides them.

### Typography

Typography does most of the work in a professional site, so spend your effort here first.

**Choose fonts from the brief.** Pick a row by personality, then pick the option that suits this client. Use one family, or at most two. Big companies use their own faces (Google Sans, Amazon Ember, Stripe's Söhne, Vercel's Geist); the lesson is that the typeface was a decision, not which one to copy.

| Personality | Good for | Options |
|---|---|---|
| Classic Swiss, neutral, confident | Agencies, architecture, finance, portfolios | Helvetica Neue stack, Switzer, Hanken Grotesk, Instrument Sans |
| Friendly geometric | Consumer apps, education, startups, local services | Poppins, DM Sans, Figtree, Outfit, Plus Jakarta Sans, Manrope |
| Corporate, institutional | B2B, enterprise, government, healthcare | IBM Plex Sans, Source Sans 3, Public Sans, Work Sans |
| Technical | Developer tools, data products | IBM Plex Sans + Plex Mono, Geist + Geist Mono, Inter (tuned) + JetBrains Mono |
| Editorial, literary | Publishing, law, nonprofits, heritage | Source Serif 4, Newsreader, Lora, Libre Caslon Text, paired with a plain sans |
| Warm, crafted | Food, cafes, bakeries, makers, family businesses | Fraunces, Recoleta-style soft serifs such as Young Serif, Lora, or a sturdy sans such as Figtree with a serif for text |
| Refined, luxury | Hospitality, fashion, jewelry, real estate | EB Garamond or Cormorant (large sizes only) with Jost or a light neutral sans |
| Expressive, modern | Creative studios, launches | General Sans, Satoshi, Bricolage Grotesque, Cabinet Grotesk |

Notes on the common choices:
- **Helvetica:** use `"Helvetica Neue", Helvetica, Arial, sans-serif`. It is installed on Apple devices and falls back to Arial on Windows. For the same look everywhere, use Switzer or Hanken Grotesk as a real web font.
- **Poppins:** wide and round, so it suits headings at weight 500 to 600 with slight negative tracking. For long text, pair it with something narrower, such as Source Sans 3 or DM Sans.
- **Inter:** perfectly good when tuned (tracking, scale, weights). Keep it if the site already uses it well. The problem is untuned Inter.
- **Pairing:** contrast the two faces clearly, for example serif with sans. Two near-identical sans-serifs look like a mistake.
- **Other scripts:** if the site has Arabic, Urdu, Devanagari, CJK or similar text, check the font covers it and choose a good companion (for example Noto Naskh Arabic or IBM Plex Sans Arabic). Use logical CSS properties such as `margin-inline-start` so RTL works.

**Scale.** Use 5 to 7 sizes. Heading levels should differ by at least a 1.25 ratio; small sizes (13 to 18px) can sit closer together. Design-led sites cluster at about these sizes:

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display / h1 | 40 to 64px, fluid | 500 to 700 | 1.05 to 1.15 | -0.02 to -0.03em |
| h2 | 32 to 48px | 500 to 600 | 1.15 to 1.2 | -0.02em |
| h3 | 20 to 28px | 500 to 600 | 1.25 to 1.3 | -0.01em |
| Body | 16 to 18px | 400 | 1.5 to 1.65 | 0 |
| Small, labels | 13 to 14px | 400 to 500 | 1.4 to 1.5 | 0 |

Rules that separate pro type from default type:
- Tracking tightens as size grows, and never loosens on body text. Don't over-tighten: letters must never touch or look crushed. Tune by eye per font, and start looser on faces that are already tight or heavy, such as Bricolage Grotesque or anything at weight 700 and up.
- Use two or three weights at most. Build hierarchy through size, weight and color together. Secondary text should be a softer color, rather than smaller and fainter.
- Display weight is rarely 800. Large text at 500 to 600 looks more expensive than `font-bold`.
- Keep text blocks to `max-width: 65ch`. Long headlines get a smaller size or fewer words.
- Left-align anything longer than about two lines.
- Add `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs. Use `font-variant-numeric: tabular-nums` for figures in columns, not for large standalone prices.
- Reserve uppercase for very short labels.
- Load fonts properly: self-host or use the framework's loader (`next/font`, `@fontsource`). On a plain static site a Google Fonts `<link>` with `preconnect` is acceptable. Use `font-display: swap`, only the weights you use, and a sensible fallback stack.

### Color

- Build a neutral ramp of about 8 to 10 steps, tinted slightly toward your accent or the brand mood. Pure default grays read as unconsidered.
- Use one accent, from the brand or industry. Reserve it for actions and key emphasis, roughly 10% of the page or less. Most of the page is neutrals. A lighter tint of the same hue is fine on dark backgrounds. A light accent such as yellow needs dark text, and on white it needs a border or a darker edge to stay visible.
- Add status colors only where used, and keep them calm. Rainbow badges look like a default.
- Backgrounds: white or a near-white chosen on purpose. Text: near-black, not `#000`.
- Dark mode: tinted near-black like `#0b0f19` or `#111`, surfaces one step lighter, off-white text. Show depth with lighter surfaces and hairlines rather than shadows.
- Name tokens by role: `--color-action`, `--color-text-muted`, `--color-surface-raised`. Never `--purple-gradient-start`.
- Check contrast: WCAG AA, 4.5:1 for body text and 3:1 for large text and UI parts. On a colored background, use a darker shade of that color or near-white rather than gray.
- Gradients: flat color is the safe default. If one is used, keep it to a single hue, subtle, and with a reason.

### Spacing and layout

White space should be assigned on purpose, not left over.

- Use a 4/8 spacing scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`. Most UI uses 8, 12, 16, 24 and 32.
- **Proximity carries the meaning.** Space inside a group must be clearly smaller than space between groups. A heading sits closer to its own text than to whatever came before it. Uniform gaps are the main reason AI layouts feel flat.
- Content width about 1200px (1120 to 1280), with side gutters of 16px on mobile, 24 on tablet and 32 or more on desktop. Nav, sections and footer should share the same left edge.
- Section padding: about 64px on mobile and 96 to 128 on desktop. Vary it by content. Identical rhythm in every section is itself a tell.
- Design at phone width first. Stack and reorder deliberately rather than just shrinking.

**Breaking the template.** Pick the structure from the content:
- Hero: try left-aligned text with the product or photo beside it, or a large image with a short headline. Centered is fine for very short messages. Show the real thing (screenshot, food, building, work) as early as possible.
- Replace the three-card row where you can: a two-column list with dividers, alternating text and image rows, one large feature with smaller supporting ones, a table, or a plain list. Cards are for items that act as separate objects.
- Vary treatment between sections: one with a full-bleed image, one on a tinted band, one that is only well-set text.
- Use dividers and space instead of boxes. If a card is inside a card, flatten it.
- Keep sections only if they carry real content. Removing a thin section beats filling it.
- Use any one pattern at most once per page. In particular, "heading on the left, ruled list on the right" and "hairline rows everywhere" are the default that models reach for when told to avoid cards. Well-made cards are still good design: keep them where the items really are separate things, and give them a proper surface, radius and shadow.

**Match the site type.** Marketing rules don't apply everywhere:
- Marketing or SaaS: strong hero, one clear action, real product shots, proof if real.
- Local business: phone, address, hours and booking in reach at once, real photos, map.
- Portfolio: the work is the design. Large images, minimal chrome, sparse type.
- E-commerce: consistent image ratios, price and add-to-cart clear, trust details near the action.
- Dashboard or app: no hero. Denser (14px body, 32 to 36px controls), sidebar or top bar, restrained color, clear tables, and thought-out empty, loading and error states.

### Radius

Scale radius with the element instead of using one value:
- Small controls, inputs, buttons: 6 to 8px (8px is the measured median)
- Cards: 8 to 12px, 16px at most
- Modals: 12 to 16px
- Full pill: tags, and buttons only if it fits the brand (about a quarter of top sites use it)

Sharp 0 to 4px radii look classic and editorial. Pick the family deliberately, and avoid 24px and up on small cards.

### Shadows

A shadow means "this is above the page". Use a few, and keep them soft rather than heavy. The values below are for UI surfaces; a large hero image or print on a pale page can take a stronger ambient layer, around .2 to .3 opacity, so that it actually reads. Only 13% of primary buttons on design-led sites have a shadow at all.

- **Use them on:** dropdowns, popovers, modals, the nav once it is stuck and scrolling, one hero product image, one highlighted card. Most finished pages have two or three shadowed things at rest, and a site with none can look flat. If the owner asked for drop shadows, make them visible somewhere on the first screen.
- **Skip them on:** every card, every section and every button. Resting cards usually need a hairline or a background step instead.
- Build each level from two layers, a tight contact shadow plus a soft ambient one. Tint with your darkest neutral, not pure black. Keep the opacity low.
- For a resting card, pick an edge or elevation. A crisp ring plus a tight shadow works. A hairline plus a wide fuzzy shadow does not.

```css
:root {
  --shadow-rgb: 17 24 39; /* your darkest neutral, as RGB channels */
  --shadow-xs: 0 1px 2px rgb(var(--shadow-rgb) / .06);
  --shadow-sm: 0 1px 2px rgb(var(--shadow-rgb) / .06), 0 2px 4px rgb(var(--shadow-rgb) / .05);
  --shadow-md: 0 1px 3px rgb(var(--shadow-rgb) / .08), 0 6px 16px -4px rgb(var(--shadow-rgb) / .10);
  --shadow-lg: 0 2px 6px rgb(var(--shadow-rgb) / .08), 0 16px 40px -8px rgb(var(--shadow-rgb) / .16);
  --ring: 0 0 0 1px rgb(var(--shadow-rgb) / .08); /* hairline as a shadow: no layout shift */
}
```

### Motion

- Hover and press: about 150ms. State changes and panels: 200 to 300ms. Ease-out curves such as `cubic-bezier(.2, .8, .2, 1)`. No bounce.
- Animate `transform` and `opacity` only.
- Motion should respond to something the user did. Remove blanket scroll-reveals; one small entrance on the hero is the maximum.
- Honor `prefers-reduced-motion`.

## Components

### Logo

- Top left, links home, with a real accessible name. Render it about 24 to 32px tall, as SVG (or live text for a wordmark), with clear space around it.
- If there's a real logo, use it and don't redraw it.
- If there is none, make a wordmark: the name set in the display font at a chosen weight and tracking. That beats a gradient square with a letter or a generic icon, and it looks honest. Mention in the report that a real logo is worth commissioning.
- Add a favicon and a dark-background version if needed.

### Navigation

This is the long-standing web convention, and users rely on it:

- Layout: logo left, links next, actions far right. Height 56 to 72px (64 is a good default). Same container width and left edge as the page content.
- 3 to 6 links, short labels, 14 to 15px at weight 500 or 400. Everything else moves to the footer.
- One primary button at most, on the right. "Log in" sits beside it as a plain text link.
- On multi-page sites, show the current page (`aria-current="page"`) with a color or weight change. Keep hover quiet.
- Sticky only if it helps, and keep it short. Transparent or solid at the top, with a hairline or `--shadow-xs` appearing after scroll. A light backdrop blur is acceptable here, and nowhere else.
- Mobile (under about 768 to 900px): if a few short links fit on one line at 320px, just keep them. Otherwise, logo plus a menu button with at least 44px target. The menu is a real panel with large tap targets. It needs `aria-expanded`, closes on Escape, on a link click and on outside tap, and locks background scroll. Keep the primary action visible in it.
- Add a skip link as the first focusable element.

### Buttons

Measured median on design-led sites: 8px radius, about 8 by 15px padding, 15px label, weight 500.

| Size | Height | Horizontal padding | Text |
|---|---|---|---|
| Small | 32px | 12px | 13 to 14px |
| Medium | 40px | 16px | 14 to 15px |
| Large | 48px | 20 to 24px | 15 to 16px |

- **Hierarchy:** primary (solid accent), secondary (outline or neutral fill), tertiary (text only). One primary per section; two solid buttons side by side compete. A nav button repeating the hero's action is fine.
- **Placement:** in a hero, use the Large size, primary first, then secondary. In page forms, align the submit button with the left edge of the fields. In dialogs, put actions bottom right with the primary last. Keep destructive actions apart from the safe option.
- **Labels:** verb plus object ("Book a table", "See pricing"), sentence case. Use "Get started" only if nothing is more specific.
- **Touch targets:** at least 44px on mobile, 24px as the WCAG AA floor. Raise Medium to 44px at phone widths.
- **Icons:** 16px, with an 8px gap, only when they add meaning.
- **All six states** belong in the shared button styles: default, hover, focus, active, disabled, loading. On sites with no forms or async actions, links need only the first four. Loading keeps the button's width, shows a spinner, sets `aria-busy` and blocks double submit.
- No gradients, glows, or hover scaling. Hover is a small color shift, and press is a slightly darker color or a 1px nudge.
- Use `<a>` for navigation and `<button>` for actions.

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 40px; padding-inline: 16px;
  font: 500 15px/1 var(--font-sans); white-space: nowrap;
  border: 1px solid transparent; border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 150ms var(--ease-out), border-color 150ms var(--ease-out), transform 100ms var(--ease-out);
}
.btn-primary { background: var(--color-action); color: var(--color-on-action); }
.btn-primary:hover { background: var(--color-action-hover); }
.btn:active { transform: translateY(1px); }
.btn:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
.btn:disabled, .btn[aria-disabled="true"] { opacity: .5; cursor: not-allowed; }
```

### Cards, forms, tables, footer

- **Cards:** vary them by content, and make padding fit the size (16 to 32px). If the whole card is clickable, give it one hover state and one link.
- **Forms:** visible labels above fields, never placeholder-only. Same height as buttons (40 to 48px), 16px font on mobile so iOS doesn't zoom. Errors in text next to the field, plus focus, disabled and success states. Group related fields.
- **Tables:** left-align text, right-align numbers, tabular figures, row dividers instead of a grid of boxes.
- **Imagery:** in order of preference: real photos or screenshots; a labelled product mock-up built in HTML and CSS; a marked, well-proportioned placeholder frame showing where the owner's photo goes; a layout carried by type and color. Remove 3D blobs and stock-feeling AI art. For a business sold on how its things look (food, rooms, products, portfolios), use placeholder frames rather than designing the images away, so the layout is ready for real photos, and flag it. Placeholders are for the owner to replace before launch, so say plainly that the site isn't ready to go live until they are. Use consistent ratios and explicit `width`/`height`. Screenshots look best in a simple frame with a soft shadow.
- **Icons:** one set, one stroke weight, sizes of 16, 20 or 24px, inline with content rather than in tinted tiles. Emoji out.
- **Footer:** a real one finishes the site: logo, grouped links, contact, legal, a correct year. Keep it quiet, on the same grid.
- **The unglamorous pages and states:** 404, empty, loading and error states, success messages. Hand-built sites have them, and their absence is what gives templates away. Add the ones the site can really use, and don't link to legal pages that don't exist; flag those instead.

### Copy

Words are part of the design, and generic copy undoes good visuals. Tighten what's there, keeping the owner's facts and meaning: replace vague headlines with what the product does and for whom, drop buzzwords (empower, seamless, unlock, supercharge, world-class), cut filler, make button labels specific, and thin out em dashes. Add no claims. List any headline you changed in the report so the owner can veto it. If the site's real facts are too thin to write something specific, leave the copy and ask. If you can't ask, rewrite only from what the site already says.

## Code craft

The source should read as if a senior engineer wrote it, since a buyer or a teammate will open it.

- **Tokens in one place:** CSS variables in `:root`, or the Tailwind theme (`@theme` in v4, `tailwind.config` in v3). No raw hex values or one-off pixel values scattered around (favicons, `theme-color` and share images are the natural exceptions), and no arbitrary Tailwind values like `p-[13px]` without a reason.
- **Shared primitives:** extract repeated markup into components such as `Button`, `Container`, `Section`, using the project's existing conventions. Remove copy-pasted class strings.
- **Semantic HTML:** `header`, `nav`, `main`, `section`, `footer`, one `h1`, no skipped heading levels, real lists, `button` and `a` used correctly. Replace div soup.
- **Remove the residue:** dead CSS, unused imports and components, narrating comments (`{/* Hero Section */}`, `// Add some padding`), `!important`, inline styles, leftover `console.log`. Keep comments that explain why.
- **Consistency:** one naming convention, one way of doing things, matching what the codebase already does. Avoid clever abstractions; a small diff that reads naturally is what seniority looks like.
- **Finish:** a real `<title>` and meta description per page, Open Graph image, favicon, `lang` attribute, descriptive `alt`, lazy-loaded images below the fold, modern formats, no layout shift when images load, and a fallback font close in size to the web font.

## Verify

Don't call it finished until you've checked it. Fix what you find.

1. The project builds, lint and tests pass as they did before, and there are no new console errors.
2. View it at 375, 768 and 1440px. No horizontal scroll, nothing clipped, nothing touching the edges.
3. Click through every page, link, form and menu. Everything still works as it did.
4. Tab through with a keyboard: visible focus everywhere, logical order, menus closable.
5. Check contrast, reduced motion, and dark mode if the site has it.
6. Re-run the audit list. Anything that remains should be deliberate.
7. **The squint test:** blur your eyes (or look at a small screenshot). Is the most important thing obvious in a second?
8. **The swap test:** cover the logo. Could this site belong to any other company? If so, the design still lacks a point of view. Go back to the brief.
9. **The overcorrection test:** did you add anything just to look designed? Parallax, custom cursors, layered gradients and decorative blobs are slop too. Remove them.
10. **The wireframe test:** did you remove so much that the page feels unfinished? Would someone pay for this, or does it look like a nicely typed document? If it's the second, add depth: imagery, a framed product view, a color band, considered shadows.

## Report

Finish with a short summary for the owner:

```markdown
## Design brief
Audience, feel, fonts, accent, layout idea, each with a one-line reason.

## What changed
Grouped by area: typography, layout, nav, buttons, and so on.

## Copy changes
Each changed headline or label, before and after.

## Needs you
Things only the owner can supply: real photos, logo, testimonials,
and any placeholder left in the site.

## Not changed or not checked
Behavior changes you avoided, and anything you couldn't verify.
```

## How reliable this guidance is

Treat the values as strong defaults, not laws. The site measurements (type sizes, button specs, content width, purple and Inter prevalence) come from the `ai-design-tells` project's survey of 202 design-led sites, a single-author dataset biased toward design-conscious companies. Accessibility numbers come from WCAG 2.2. Nav and logo placement are long-standing convention. Lists of AI tells are expert opinion and they age quickly: what reads as "AI" shifts as models change. When a rule conflicts with what the site needs, serve the site.
