# Athena Design System

## Design Philosophy

Athena's design should feel:
- **Futuristic but calm**
- **Liquid-glass inspired**, but NOT overly glossy or Apple-heavy
- **Accessible and friendly to older users**

## Design Principles

### 1. Readability First
- Large, clear typography (minimum 16px for body text)
- High contrast (WCAG AA minimum: 4.5:1)
- Avoid thin fonts (minimum 400 weight for body, 500+ for small text)
- Comfortable spacing (generous padding and margins)

### 2. Low Cognitive Load
- Clear visual hierarchy
- Obvious actions (buttons should look like buttons)
- Minimal visual clutter
- Avoid hidden or overly clever UI patterns
- Progressive disclosure (show simple first, reveal complexity as needed)

### 3. Subtle Futuristic Feel
- Soft gradients (use sparingly)
- Slight glassmorphism (blur + translucency used only for headers/modals)
- Gentle shadows for depth
- Smooth but not flashy animations
- Clean, modern sans-serif typography

### 4. Accessibility
- Keyboard navigable (tab order, focus indicators)
- Clear focus states (2-3px outline)
- Buttons and inputs large enough for less precise interaction (minimum 44x44px)
- Don't rely only on color to convey meaning
- Support screen readers with proper ARIA labels
- Respect `prefers-reduced-motion`

### 5. Consistency
- Reusable UI components (buttons, cards, tables, modals)
- Consistent spacing, radius, and shadows
- Predictable layouts across the app
- Uniform interaction patterns

---

## Color Palette

### Primary Colors (Authority & Trust)
```css
--color-primary: #3B82F6;        /* rgb(59, 130, 246) */
--color-primary-dark: #1E40AF;   /* rgb(30, 64, 175) */
--color-primary-light: #DBEAFE;  /* rgb(219, 234, 254) */
```

### Neutral Colors (Readability)
```css
--color-gray-900: #111827;  /* Text primary */
--color-gray-700: #374151;  /* Text secondary */
--color-gray-500: #6B7280;  /* Text tertiary */
--color-gray-300: #D1D5DB;  /* Borders */
--color-gray-100: #F3F4F6;  /* Backgrounds */
--color-gray-50: #F9FAFB;   /* Subtle backgrounds */
--color-white: #FFFFFF;
```

### Semantic Colors
```css
--color-success: #10B981;  /* Green - approvals, success states */
--color-warning: #F59E0B;  /* Amber - warnings, pending states */
--color-error: #EF4444;    /* Red - errors, rejections */
--color-info: #3B82F6;     /* Blue - informational messages */
```

### Futuristic Accents (Use Sparingly)
```css
--color-accent-indigo: #6366F1;  /* Gradient start */
--color-accent-violet: #8B5CF6;  /* Gradient end */
--color-glass: rgba(255, 255, 255, 0.1);
```

### Usage Guidelines
- **Primary Blue**: Main CTAs, links, active states
- **Gray Scale**: Text, borders, backgrounds
- **Success**: Grant approved, save confirmation
- **Warning**: Approaching deadlines, review needed
- **Error**: Validation errors, failed actions
- **Info**: Tooltips, helpful hints

---

## Typography

### Font Family
```css
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

**Installation**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px - Captions, labels */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-base: 1rem;     /* 16px - Body text (DEFAULT) */
--text-lg: 1.125rem;   /* 18px - Emphasized text */
--text-xl: 1.25rem;    /* 20px - Small headings */
--text-2xl: 1.5rem;    /* 24px - Section headings */
--text-3xl: 1.875rem;  /* 30px - Page titles */
--text-4xl: 2.25rem;   /* 36px - Hero text */
```

### Font Weights
```css
--font-regular: 400;    /* Body text */
--font-medium: 500;     /* Emphasis */
--font-semibold: 600;   /* Headings */
--font-bold: 700;       /* Strong emphasis */
```

### Line Heights
```css
--leading-tight: 1.25;    /* Headings */
--leading-normal: 1.5;    /* Body text */
--leading-relaxed: 1.75;  /* Long-form content */
```

### Typography Scale Examples
```
Hero Title:      36px / 600 weight / 1.25 line-height
Page Title:      30px / 600 weight / 1.25 line-height
Section Heading: 24px / 600 weight / 1.25 line-height
Subsection:      20px / 600 weight / 1.25 line-height
Body Large:      18px / 400 weight / 1.5 line-height
Body:            16px / 400 weight / 1.5 line-height
Body Small:      14px / 400 weight / 1.5 line-height
Caption:         12px / 500 weight / 1.5 line-height
```

---

## Spacing System

Use Tailwind's default 4px-based scale:

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px - Common padding */
--space-6: 1.5rem;    /* 24px - Section spacing */
--space-8: 2rem;      /* 32px - Component gaps */
--space-12: 3rem;     /* 48px - Page margins */
--space-16: 4rem;     /* 64px - Large sections */
```

### Spacing Usage
- **Component padding**: 16px (space-4)
- **Between form fields**: 24px (space-6)
- **Between sections**: 32px (space-8)
- **Page margins**: 48px (space-12)
- **Hero sections**: 64px (space-16)

---

## Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Inputs, tags */
--radius-md: 0.5rem;    /* 8px - Buttons, cards (DEFAULT) */
--radius-lg: 0.75rem;   /* 12px - Modals, panels */
--radius-xl: 1rem;      /* 16px - Hero sections */
--radius-full: 9999px;  /* Pills, avatars */
```

---

## Shadows

```css
/* Subtle elevation */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);

/* Card default */
--shadow-md: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);

/* Elevated elements */
--shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);

/* Modals, dropdowns */
--shadow-xl: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);

/* Glassmorphism effect */
--shadow-glass: 0 8px 32px rgba(31, 38, 135, 0.15);
```

### Shadow Usage
- **Cards**: shadow-md
- **Buttons (hover)**: shadow-lg
- **Modals**: shadow-xl
- **Dropdowns**: shadow-xl
- **Glass panels**: shadow-glass

---

## Glassmorphism Guidelines

Use sparingly for:
- Navigation header
- Modal overlays
- Floating action panels

**Glass Effect Formula**:
```css
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
}
```

**Dark Mode Glass**:
```css
.glass-dark {
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## Motion & Animation

### Duration
```css
--duration-fast: 150ms;   /* Hover states, tooltips */
--duration-base: 200ms;   /* Most interactions */
--duration-slow: 300ms;   /* Page transitions, modals */
```

### Easing
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);  /* Default */
--ease-out: cubic-bezier(0, 0, 0.2, 1);       /* Entrances */
--ease-in: cubic-bezier(0.4, 0, 1, 1);        /* Exits */
```

### Animation Principles
- Prefer subtle transitions over dramatic animations
- Respect `prefers-reduced-motion` media query
- Never animate without purpose
- Maximum animation duration: 500ms
- Use CSS transforms for performance (not left/top)

### Common Transitions
```css
/* Hover effects */
transition: all 200ms ease-in-out;

/* Modal entrance */
transition: opacity 300ms ease-out, transform 300ms ease-out;

/* Page transitions */
transition: opacity 200ms ease-in-out;
```

---

## Interactive States

### Button States
```css
/* Default */
background: var(--color-primary);
color: white;

/* Hover */
background: var(--color-primary-dark);
transform: translateY(-1px);
box-shadow: var(--shadow-lg);

/* Active */
background: #1E3A8A; /* Darker */
transform: translateY(0);

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
pointer-events: none;

/* Focus */
outline: 2px solid var(--color-primary);
outline-offset: 2px;
```

### Input States
```css
/* Default */
border: 1px solid var(--color-gray-300);
background: white;

/* Focus */
border-color: var(--color-primary);
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
outline: none;

/* Error */
border-color: var(--color-error);
box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);

/* Disabled */
background: var(--color-gray-100);
color: var(--color-gray-500);
cursor: not-allowed;
```

---

## Component Guidelines

### Buttons
- **Minimum size**: 44x44px (touch-friendly)
- **Padding**: 12px 24px (medium), 8px 16px (small), 16px 32px (large)
- **Border radius**: 8px
- **Font weight**: 500 (medium)

**Variants**:
- Primary: Solid background, white text
- Secondary: White background, gray border, primary text
- Outline: Transparent, primary border and text
- Ghost: Transparent, no border, primary text

### Cards
- **Padding**: 24px
- **Border radius**: 8px
- **Shadow**: shadow-md default, shadow-lg on hover
- **Border**: Optional 1px solid gray-200

### Forms
- **Label font size**: 14px (text-sm)
- **Label font weight**: 500 (medium)
- **Input height**: 44px minimum
- **Input padding**: 12px 16px
- **Gap between fields**: 24px

### Modals
- **Max width**: 600px (medium), 800px (large)
- **Padding**: 32px
- **Border radius**: 12px
- **Backdrop**: rgba(0, 0, 0, 0.5) with backdrop blur

### Tables
- **Row height**: 56px minimum
- **Cell padding**: 16px
- **Header font weight**: 600 (semibold)
- **Alternating rows**: Use gray-50 for even rows
- **Hover state**: gray-100 background

---

## Responsive Breakpoints

```css
/* Mobile first approach */
--screen-sm: 640px;   /* Tablet */
--screen-md: 768px;   /* Small laptop */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Extra large */
```

### Usage
- **Mobile**: Single column, stacked layout
- **Tablet (640px+)**: Two columns where appropriate
- **Desktop (1024px+)**: Full multi-column layouts, sidebars

---

## Accessibility Checklist

- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text (18px+)
- [ ] All interactive elements keyboard accessible
- [ ] Clear focus indicators (2-3px outline)
- [ ] Touch targets ≥ 44x44px
- [ ] Semantic HTML (proper headings, landmarks)
- [ ] ARIA labels for icon-only buttons
- [ ] Form labels associated with inputs
- [ ] Error messages programmatically associated
- [ ] Respect `prefers-reduced-motion`
- [ ] Support screen reader announcements

---

## Example Component: Primary Button

```tsx
<button className="
  px-6 py-3
  bg-primary hover:bg-primary-dark
  text-white font-medium
  rounded-lg
  shadow-md hover:shadow-lg
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  min-h-[44px]
">
  Create Grant
</button>
```

---

## Design Tokens (Tailwind Config)

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#1E40AF',
          light: '#DBEAFE',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          300: '#D1D5DB',
          500: '#6B7280',
          700: '#374151',
          900: '#111827',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.15)',
      },
    },
  },
}
```


In a descriptive way the ui should be 

1. Clarity Through Visual Hierarchy

The UI establishes what matters most at a glance.

Primary focus: Grant Overview metrics (Active, Under Review, Approved, Denied)

Secondary focus: Trend chart (Success Metrics over time)

Tertiary elements: Workspace cards, calendar, collaboration tools

How it’s achieved:

Size contrast (large cards vs smaller widgets)

Strategic placement (top-left = highest importance)

Clear typographic scale (headings > labels > metadata)

👉 Result: Users instantly understand system status without thinking.

2. Consistent, Purposeful Color System

The palette is restrained and meaningful.

Blues → trust, intelligence, stability (perfect for grants & finance)

Soft gradients → modernity and innovation

Accent highlights → draw attention to key data points (charts, active states)

Notably:

No harsh contrast

No unnecessary colors

States are color-coded without being loud

👉 Result: Professional, calm, and credible.

3. Soft Neumorphism / Glassmorphism Hybrid

This UI blends two modern trends tastefully.

Soft shadows and floating cards → depth without clutter

Semi-translucent panels → lightweight, futuristic feel

Rounded corners → friendliness and approachability

Importantly:

Effects are subtle, not gimmicky

Readability is preserved

👉 Result: Sophisticated without sacrificing usability.

4. Modular, Card-Based Layout

Everything is broken into self-contained components.

Grant Overview

Workspace projects

Calendar

Collaboration tools

Why this works:

Easy to scan

Easy to rearrange

Highly scalable for future features

👉 Result: A system that feels organized and expandable.

5. Data-First, Insight-Oriented Design

The UI prioritizes decision-making, not decoration.

Key metrics are summarized visually (numbers + rings)

Trends are shown as smooth line charts

Statuses are immediately understandable

There’s no raw data dump—only interpreted insights.

👉 Result: Users act faster and with confidence.

6. Strong Affordances & Intuitive Interaction

You can tell what’s clickable without being told.

Cards look tappable

Buttons have depth

Icons are familiar and minimal

No learning curve needed.

👉 Result: Excellent usability for both new and experienced users.

7. Collaborative-by-Design

Collaboration isn’t an afterthought.

Avatars embedded in projects

Shared workspaces visible

Human presence integrated into the system

This subtly reinforces teamwork and accountability.

👉 Result: The system feels alive, not bureaucratic.

8. Brand Alignment with “Athena”

The UI reflects the brand identity perfectly:

Wisdom → clean structure, data clarity

Strategy → planning tools, metrics, calendar

Authority → polished, confident visuals

Innovation → modern UI patterns and motion-friendly layout

Even the owl logo fits seamlessly into the interface style.

👉 Result: Brand and product feel like one cohesive experience.

9. Scalability & Responsiveness (Implied)

The layout strongly suggests:

Easy responsiveness across devices

Reusable components

Design-system-driven thinking

This isn’t a one-off screen — it’s a platform.

In One Sentence

This UI follows a data-driven, modular, modern design philosophy that balances trust, clarity, and innovation while staying highly usable and scalable.