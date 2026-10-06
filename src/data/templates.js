export const WEBSITE_TEMPLATES = [
  {
    id: 'saas-landing',
    name: 'SaaS Landing Page',
    icon: '🚀',
    description: 'Modern product landing with hero, features, pricing, testimonials',
    pages: ['Hero', 'Features', 'How It Works', 'Pricing', 'Testimonials', 'FAQ', 'CTA'],
    animations: ['scroll-reveal', 'parallax-hero', 'counter-up', 'stagger-cards', 'floating-elements'],
    color: 'accent',
  },
  {
    id: 'portfolio',
    name: 'Creative Portfolio',
    icon: '🎨',
    description: 'Stunning portfolio with case studies, smooth transitions, and gallery',
    pages: ['Home', 'About', 'Work', 'Case Study', 'Contact'],
    animations: ['cursor-follow', 'magnetic-hover', 'page-transitions', 'parallax-images', 'text-reveal'],
    color: 'teal',
  },
  {
    id: 'agency',
    name: 'Digital Agency',
    icon: '⚡',
    description: 'High-impact agency site with bold typography and kinetic animations',
    pages: ['Home', 'Services', 'Work', 'Team', 'Blog', 'Contact'],
    animations: ['marquee-scroll', 'split-text', 'hover-distort', 'scroll-scrub', 'morph-shapes'],
    color: 'coral',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Store',
    icon: '🛍️',
    description: 'Premium product store with smooth cart, filters, and product showcases',
    pages: ['Home', 'Products', 'Product Detail', 'Cart', 'Checkout', 'About'],
    animations: ['product-zoom', 'cart-fly', 'filter-sort', 'image-gallery', 'add-to-cart'],
    color: 'accent',
  },
  {
    id: 'startup',
    name: 'Tech Startup',
    icon: '💡',
    description: 'Minimal tech startup with data visualizations and bold statements',
    pages: ['Landing', 'Product', 'Pricing', 'Blog', 'Careers', 'Docs'],
    animations: ['typewriter', 'data-viz', 'scroll-progress', 'hover-cards', 'gradient-shift'],
    color: 'teal',
  },
  {
    id: 'restaurant',
    name: 'Restaurant / Food',
    icon: '🍽️',
    description: 'Elegant restaurant site with menu, reservations, and immersive visuals',
    pages: ['Home', 'Menu', 'About', 'Gallery', 'Reservations', 'Contact'],
    animations: ['parallax-plates', 'menu-hover', 'scroll-reveal', 'image-parallax', 'smooth-scroll'],
    color: 'coral',
  },
  {
    id: 'blog-magazine',
    name: 'Blog / Magazine',
    icon: '📰',
    description: 'Editorial-style blog with reading progress, featured articles, categories',
    pages: ['Home', 'Article', 'Category', 'Author', 'Search', 'Subscribe'],
    animations: ['reading-progress', 'article-reveal', 'image-lazy', 'category-filter', 'dark-mode'],
    color: 'accent',
  },
  {
    id: 'nft-crypto',
    name: 'NFT / Web3',
    icon: '🔮',
    description: 'Futuristic Web3 platform with 3D elements, wallet connect, marketplace',
    pages: ['Home', 'Explore', 'Collection', 'NFT Detail', 'Profile', 'Create'],
    animations: ['3d-tilt', 'particle-bg', 'glow-hover', 'mint-animation', 'wallet-connect'],
    color: 'accent',
  },
];

export const GSAP_ANIMATIONS = {
  'scroll-reveal': {
    name: 'Scroll Reveal',
    description: 'Elements fade and slide in as user scrolls',
    code: 'gsap.from(elements, { opacity: 0, y: 60, duration: 0.8, stagger: 0.15, scrollTrigger: { trigger, start: "top 80%" } })',
  },
  'parallax-hero': {
    name: 'Parallax Hero',
    description: 'Hero section moves at different speeds on scroll',
    code: 'gsap.to(heroEl, { yPercent: -30, ease: "none", scrollTrigger: { trigger, start: "top top", end: "bottom top", scrub: 1.5 } })',
  },
  'text-reveal': {
    name: 'Text Reveal',
    description: 'Cinematic text split and reveal animation',
    code: 'gsap.from(SplitText lines, { yPercent: 100, duration: 1, stagger: 0.08, ease: "expo.out" })',
  },
  'stagger-cards': {
    name: 'Stagger Cards',
    description: 'Cards appear one after another with spring easing',
    code: 'gsap.from(cards, { opacity: 0, y: 40, scale: 0.95, stagger: 0.1, duration: 0.6, ease: "back.out(1.5)" })',
  },
  'counter-up': {
    name: 'Counter Animation',
    description: 'Numbers count up from 0 to target value',
    code: 'gsap.to(target, { innerText: endValue, snap: "innerText", duration: 2, ease: "power3.out", scrollTrigger })',
  },
  'magnetic-hover': {
    name: 'Magnetic Hover',
    description: 'Elements are attracted to cursor magnetically',
    code: 'onMouseMove: gsap.to(el, { x: relX * 0.4, y: relY * 0.4, duration: 0.5, ease: "power2.out" })',
  },
  'cursor-follow': {
    name: 'Custom Cursor',
    description: 'Custom cursor that follows mouse with lag',
    code: 'gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.5, ease: "power2.out" })',
  },
  'marquee-scroll': {
    name: 'Infinite Marquee',
    description: 'Horizontal ticker tape scrolling text',
    code: 'gsap.to(track, { xPercent: -50, ease: "none", duration: 20, repeat: -1 })',
  },
  'split-text': {
    name: 'Split Text Effect',
    description: 'Words and characters animate individually',
    code: 'new SplitText(heading, { type: "chars,words" }); gsap.from(chars, { yPercent: 100, opacity: 0, stagger: 0.03 })',
  },
  'page-transitions': {
    name: 'Page Transitions',
    description: 'Smooth GSAP-powered route transitions',
    code: 'gsap.timeline().to(overlay, { scaleY: 1, duration: 0.5, ease: "power3.inOut" }).to(overlay, { scaleY: 0, duration: 0.5 })',
  },
  'hover-distort': {
    name: 'SVG Distort Hover',
    description: 'Images distort and warp on hover using SVG filters',
    code: 'gsap.to(feTurbulence, { attr: { baseFrequency: 0.05 }, duration: 0.3, ease: "power2.out" })',
  },
  'scroll-scrub': {
    name: 'Scroll Scrub',
    description: 'Animation directly tied to scroll position',
    code: 'gsap.to(el, { rotate: 360, scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true } })',
  },
  'floating-elements': {
    name: 'Floating Elements',
    description: 'UI elements gently bob and float',
    code: 'gsap.to(el, { y: -15, duration: 2, ease: "power1.inOut", yoyo: true, repeat: -1 })',
  },
  'morph-shapes': {
    name: 'SVG Morphing',
    description: 'SVG paths morph between shapes',
    code: 'gsap.to(path, { morphSVG: targetPath, duration: 1.5, ease: "elastic.out(1, 0.5)" })',
  },
  'typewriter': {
    name: 'Typewriter Effect',
    description: 'Text types itself character by character',
    code: 'gsap.to(el, { text: { value: fullText, delimiter: "" }, duration: 2, ease: "none" })',
  },
  'gradient-shift': {
    name: 'Gradient Animation',
    description: 'Background gradients smoothly shift colors',
    code: 'gsap.to(el, { "--gradient-angle": "360deg", duration: 8, ease: "none", repeat: -1 })',
  },
  '3d-tilt': {
    name: '3D Card Tilt',
    description: 'Cards tilt in 3D on mouse movement',
    code: 'onMouseMove: gsap.to(card, { rotateX: tiltY * 20, rotateY: tiltX * -20, duration: 0.5 })',
  },
  'particle-bg': {
    name: 'Particle Background',
    description: 'Animated particle field in background',
    code: 'particles connected by proximity using canvas + GSAP ticker for 60fps updates',
  },
};

export const ANIMATION_PRESETS = [
  {
    id: 'minimal',
    name: 'Minimal & Subtle',
    description: 'Clean, purposeful animations that enhance without distraction',
    animations: ['scroll-reveal', 'stagger-cards', 'counter-up'],
  },
  {
    id: 'dynamic',
    name: 'Dynamic & Engaging',
    description: 'Energetic animations that create memorable experiences',
    animations: ['text-reveal', 'parallax-hero', 'stagger-cards', 'magnetic-hover', 'floating-elements'],
  },
  {
    id: 'cinematic',
    name: 'Cinematic & Dramatic',
    description: 'Film-quality transitions and storytelling through motion',
    animations: ['page-transitions', 'split-text', 'scroll-scrub', 'text-reveal', 'hover-distort'],
  },
  {
    id: 'futuristic',
    name: 'Futuristic & Immersive',
    description: 'Cutting-edge effects with 3D and particle systems',
    animations: ['3d-tilt', 'particle-bg', 'gradient-shift', 'cursor-follow', 'morph-shapes'],
  },
];

export const COLOR_PALETTES = [
  { id: 'midnight', name: 'Midnight Purple', primary: '#7c6af7', secondary: '#2dd4bf', accent: '#f97316', bg: '#0a0a0f' },
  { id: 'ocean', name: 'Deep Ocean', primary: '#0ea5e9', secondary: '#06b6d4', accent: '#f59e0b', bg: '#050d1a' },
  { id: 'forest', name: 'Dark Forest', primary: '#22c55e', secondary: '#84cc16', accent: '#ec4899', bg: '#030a06' },
  { id: 'ember', name: 'Ember & Ash', primary: '#f97316', secondary: '#ef4444', accent: '#facc15', bg: '#0f0905' },
  { id: 'arctic', name: 'Arctic White', primary: '#1e293b', secondary: '#475569', accent: '#6366f1', bg: '#f8fafc' },
  { id: 'neon', name: 'Neon Cyber', primary: '#a855f7', secondary: '#22d3ee', accent: '#f0abfc', bg: '#030309' },
  { id: 'rose', name: 'Rose Gold', primary: '#f43f5e', secondary: '#fb923c', accent: '#fbbf24', bg: '#0f0507' },
  { id: 'slate', name: 'Steel & Chrome', primary: '#94a3b8', secondary: '#64748b', accent: '#7c6af7', bg: '#0f1117' },
];

export const INDUSTRY_TYPES = [
  'Technology / SaaS', 'Design / Creative', 'Finance / Fintech',
  'Health / Wellness', 'Education / E-Learning', 'Real Estate',
  'Fashion / Beauty', 'Food & Beverage', 'Gaming / Entertainment',
  'Web3 / Crypto', 'Travel / Hospitality', 'Non-Profit / Social',
];

export const TONE_OPTIONS = [
  { id: 'professional', label: '💼 Professional', desc: 'Clean, authoritative, trustworthy' },
  { id: 'playful', label: '🎉 Playful', desc: 'Fun, energetic, approachable' },
  { id: 'luxury', label: '💎 Luxury', desc: 'Premium, exclusive, sophisticated' },
  { id: 'minimal', label: '⚡ Minimal', desc: 'Clean, focused, no-nonsense' },
  { id: 'bold', label: '🔥 Bold', desc: 'Impactful, daring, memorable' },
  { id: 'friendly', label: '👋 Friendly', desc: 'Warm, inviting, community-focused' },
];
