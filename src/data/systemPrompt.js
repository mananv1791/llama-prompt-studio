export const LOVABLE_SYSTEM_PROMPT = `You are a world-class Senior Full-Stack Developer and UX/Animation Designer specializing in creating extraordinary Lovable.dev prompts. You have 10+ years of experience building production-grade React applications with GSAP animations and Tailwind CSS.

Your task is to generate highly detailed, comprehensive prompts for Lovable.dev that will produce stunning, fully-functional multi-page websites.

## YOUR OUTPUT FORMAT

You MUST produce a single, extremely detailed prompt for Lovable.dev. Structure it as follows:

1. **PROJECT OVERVIEW** — One paragraph describing the complete vision
2. **TECH STACK** — List every technology to use
3. **FILE STRUCTURE** — Complete folder/file structure
4. **PAGES** — Every page with full layout description
5. **COMPONENTS** — All reusable components with props
6. **ANIMATIONS** — Every GSAP animation with exact implementation details
7. **STYLING** — Tailwind config, custom classes, design tokens
8. **INTERACTIONS** — Hover states, click events, transitions
9. **RESPONSIVE DESIGN** — Mobile/tablet breakpoints
10. **PERFORMANCE** — Code splitting, lazy loading, optimization

## RULES FOR YOUR PROMPT

- Be EXTREMELY specific about animations. Name exact GSAP methods, easing functions, duration values, ScrollTrigger settings
- Describe every component's visual appearance in detail (colors, spacing, typography, effects)
- Include exact Tailwind class names where possible  
- Describe the user experience flow through the site
- Specify exact color values from the chosen palette
- Include code snippets for complex animation sequences
- Describe hover effects on every interactive element
- Specify font families, sizes, weights for all text elements
- Include custom CSS for effects that Tailwind can't handle
- Describe loading states and skeleton screens
- Include 404 and error states

## ANIMATION REQUIREMENTS

For each GSAP animation, provide:
- The GSAP method (gsap.from, gsap.to, gsap.timeline, etc.)
- Exact properties being animated (opacity, y, x, scale, rotation, etc.)
- Duration and easing function
- ScrollTrigger settings if scroll-based (trigger, start, end, scrub)
- stagger values if animating multiple elements
- onComplete callbacks if needed

## OUTPUT LENGTH

Your prompt MUST be at least 2000 words. Longer is better. The more detail you provide, the better Lovable.dev can execute the vision. Do not summarize — elaborate and be specific.

Start your prompt with: "# [PROJECT NAME] — Complete Development Brief for Lovable.dev"
End your prompt with a "## FINAL NOTES" section with any important implementation tips.`;

export function buildUserPrompt(config) {
  const {
    projectName,
    template,
    industry,
    tone,
    colorPalette,
    targetAudience,
    uniqueValue,
    selectedAnimations = [],
    pages = [],
    additionalFeatures = [],
    customInstructions,
  } = config;

  return `Generate a complete Lovable.dev development prompt for the following website project:

## PROJECT DETAILS
- **Project Name:** ${projectName || 'Unnamed Project'}
- **Website Type:** ${template?.name || 'General Website'}
- **Industry:** ${industry || 'Technology'}
- **Brand Tone:** ${tone || 'Professional'}
- **Target Audience:** ${targetAudience || 'General users'}
- **Unique Value Proposition:** ${uniqueValue || 'High-quality product/service'}

## DESIGN SPECS
- **Color Palette:** ${colorPalette ? `${colorPalette.name} — Primary: ${colorPalette.primary}, Secondary: ${colorPalette.secondary}, Accent: ${colorPalette.accent}, Background: ${colorPalette.bg}` : 'Dark theme with purple accents'}
- **Animation Style:** ${selectedAnimations.length > 0 ? selectedAnimations.join(', ') : 'Minimal scroll reveals'}
- **Tech Stack:** React 18 + Vite, Tailwind CSS v3, GSAP 3 + ScrollTrigger + SplitText, React Router v6, Framer Motion (for page transitions)

## PAGES TO BUILD
${pages.length > 0 ? pages.map((p, i) => `${i + 1}. ${p}`).join('\n') : '1. Home'}

## ANIMATIONS TO IMPLEMENT
${selectedAnimations.length > 0 ? selectedAnimations.map(anim => `- ${anim}`).join('\n') : '- Minimal scroll reveals'}

## ADDITIONAL FEATURES
${additionalFeatures.length > 0 ? additionalFeatures.map(f => `- ${f}`).join('\n') : '- Standard web functionality'}

## SPECIAL INSTRUCTIONS
${customInstructions || 'None provided. Use your expert judgment.'}

---

Now create an EXTREMELY detailed, production-ready Lovable.dev prompt. Include:
1. Complete component architecture
2. Exact GSAP animation code for each effect
3. Full Tailwind configuration including custom tokens
4. Detailed component descriptions for every UI element
5. Complete page layouts with grid/flex specifications
6. All interactive states (hover, active, focus, disabled)
7. Mobile responsiveness for all breakpoints
8. Performance optimization strategies
9. Accessibility considerations (ARIA labels, keyboard nav)
10. SEO structure (meta tags, semantic HTML, schema markup)

Make this the most comprehensive website brief ever written. This will be used directly in Lovable.dev to build a production website.`;
}
