// Shared catalogue used across the standalone pages.

export const SERVICES = [
  {
    name: 'Canapés & Cocktail Catering', from: 250000, img: '/media/img1.jpg',
    desc: 'Gourmet canapé platters, brioche mini sliders, cocktail snack stations and themed buffets — from intimate gatherings to 500+ guest events. The service that built the name.',
  },
  {
    name: 'Private Dining', from: 300000, img: '/media/video2_poster.jpg',
    desc: 'Curated 2–12 person dinner experiences. Bespoke menu design, live cooking and full table styling — every detail intentional and immaculate.',
  },
  {
    name: 'Tablescape Styling', from: 300000, img: '/media/event_spread.jpg',
    desc: 'Elevated tablescape experiences featuring signature styling, tiered displays, fresh fruit arrangements, floral accents, ambient lighting, and bespoke menu cards — crafted for weddings, corporate events, brand activations, and luxury celebrations.',
  },
  {
    name: 'Celebration Boxes', from: 80000, img: '/media/celebration_box_poster.jpg',
    desc: 'Branded food hampers — clear-lid kraft boxes, organza ribbons, custom tags and signature canapés & bakes. Valentine’s, Christmas, Eid, Corporate. Lagos delivery + shipping.',
  },
]

// Service options for the booking form — EVENTS ONLY (no courses/training)
export const SERVICE_OPTIONS = [
  'Canapés & Cocktail Catering',
  'Private Dining',
  'Tablescape Styling',
  'Celebration Boxes',
]

// "From" prices for the deposit calculator (events only)
export const SERVICE_FROM = {
  'Canapés & Cocktail Catering': 250000,
  'Private Dining': 300000,
  'Tablescape Styling': 300000,
  'Celebration Boxes': 80000,
}

export const MENU = [
  { name: 'Signature Canapé Platter', meta: 'Brioche sliders, spring rolls, snack stations', price: 'From ₦250,000' },
  { name: 'Poolside Fruit Tablescape', meta: 'Watermelon, grapes, kiwi, coconut bowls', price: 'From ₦120,000' },
  { name: 'Grazing Table', meta: 'Charcuterie, fresh fruit, warm bites', price: 'From ₦300,000' },
  { name: 'Mini Slider Bar', meta: 'Beef, chicken & veggie, live heat lamps', price: 'From ₦180,000' },
  { name: 'Private Dinner (per head)', meta: 'Bespoke multi-course, live cooking', price: 'From ₦50,000' },
  { name: 'Celebration Box', meta: 'Branded hamper, ribbons, custom tags', price: 'From ₦80,000' },
]

export const COURSES = [
  { name: 'Canapés Masterclass', meta: '6 modules · Online · Certificate', price: '₦25,000' },
  { name: 'Event Setup & Styling 101', meta: '8 modules · Online + Live · Certificate', price: '₦35,000' },
  { name: 'Nigerian Gourmet Essentials', meta: '5 modules · Online · Certificate', price: '₦20,000' },
  { name: 'Catering Business Blueprint', meta: '10 modules · Online · Certificate', price: '₦75,000' },
  { name: '1-on-1 Mentorship Session', meta: '60 min · Video call · Recording', price: '₦80,000' },
  { name: 'Small Chops Saturday Workshop', meta: 'Live · Lagos pop-up · Virtual stream', price: '₦15,000' },
]

export const GALLERY = [
  { type: 'video', src: '/media/video1.mp4', poster: '/media/video1_poster.jpg' },
  { type: 'img', src: '/media/event_spread.jpg', alt: 'Styled event spread' },
  { type: 'img', src: '/media/img1.jpg', alt: 'Canapé platter' },
  { type: 'video', src: '/media/celebration_box.mp4', poster: '/media/celebration_box_poster.jpg' },
  { type: 'img', src: '/media/img2.jpg', alt: 'Fruit tablescape' },
  { type: 'video', src: '/media/video3.mp4', poster: '/media/video3_poster.jpg' },
  { type: 'img', src: '/media/img4.jpg', alt: 'Poolside fruit platter' },
  { type: 'video', src: '/media/video4.mp4', poster: '/media/video4_poster.jpg' },
  { type: 'img', src: '/media/img3.jpg', alt: 'Fruit platter' },
  { type: 'img', src: '/media/img5.jpg', alt: 'Fruit platter by the pool' },
]

export const naira = (n) => '₦' + Number(n).toLocaleString('en-NG')

// ── Event styling options (booking form) ──────────────────────────────────────
export const COLOR_THEMES = [
  { name: 'Blush & Gold', colors: ['#f3c6bd', '#c9a84c'] },
  { name: 'Burgundy & Cream', colors: ['#7b2233', '#efe7db'] },
  { name: 'Royal Blue & Silver', colors: ['#20347e', '#c7cbd1'] },
  { name: 'Emerald & Gold', colors: ['#1f6f54', '#c9a84c'] },
  { name: 'All White', colors: ['#ffffff', '#ece7df'] },
  { name: 'Coral & Peach', colors: ['#ff6f5e', '#ffd6b0'] },
  { name: 'Lavender & Silver', colors: ['#9c86d0', '#d6d9dd'] },
  { name: 'Black & Gold', colors: ['#1a1a1a', '#c9a84c'] },
  { name: 'Dusty Rose & Sage', colors: ['#c78a8a', '#9caf88'] },
  { name: 'Terracotta & Ivory', colors: ['#c96f4a', '#efe7db'] },
  { name: 'Champagne & Nude', colors: ['#e6cfa8', '#e3c9b8'] },
  { name: 'Wine & Rose Gold', colors: ['#5e1f2d', '#d8a48f'] },
]

export const FLOWERS = [
  'Roses', 'Lilies', 'Orchids', 'Anthurium', 'Chrysanthemums', 'Baby’s Breath',
  'Sunflowers', 'Tulips', 'Carnations', 'Peonies', 'Hydrangeas', 'Gerbera Daisies',
  'Calla Lilies', 'Eucalyptus Greenery',
]

export const ACCESSORIES = [
  'Tiered risers', 'Chafing dishes', 'Heat lamps', 'Floral arch / backdrop',
  'Charger plates', 'Table runners & linen', 'Menu cards', 'Balloon garland',
  'Grazing boards', 'Fresh fruit display', 'Dessert table', 'Cake stand',
  'Napkin styling', 'Signage / name cards',
]

export const LIGHTING = [
  'Warm ambient lighting', 'Fairy / string lights', 'LED uplighting',
  'Candles & candelabras', 'Neon sign', 'Spotlights', 'Lanterns',
]

export const VENUES = [
  'Indoor', 'Outdoor', 'Terrace', 'Poolside', 'Garden',
  'Hall / Banquet', 'Rooftop', 'Marquee / Tent', 'Beach',
]

// One-tap decor bundles that pre-select a whole look
export const PRESETS = [
  {
    name: 'Intimate Birthday', theme: 'Blush & Gold',
    flowers: ['Roses', 'Baby’s Breath'],
    accessories: ['Cake stand', 'Balloon garland', 'Dessert table'],
    lighting: ['Fairy / string lights', 'Candles & candelabras'], venue: ['Indoor'],
  },
  {
    name: 'Luxe Wedding', theme: 'Champagne & Nude',
    flowers: ['Peonies', 'Hydrangeas', 'Eucalyptus Greenery'],
    accessories: ['Floral arch / backdrop', 'Charger plates', 'Table runners & linen', 'Menu cards'],
    lighting: ['Warm ambient lighting', 'LED uplighting'], venue: ['Hall / Banquet'],
  },
  {
    name: 'Corporate Elegant', theme: 'Black & Gold',
    flowers: ['Orchids', 'Anthurium'],
    accessories: ['Menu cards', 'Signage / name cards', 'Grazing boards'],
    lighting: ['Spotlights', 'LED uplighting'], venue: ['Indoor'],
  },
  {
    name: 'Garden Party', theme: 'Dusty Rose & Sage',
    flowers: ['Sunflowers', 'Gerbera Daisies', 'Eucalyptus Greenery'],
    accessories: ['Grazing boards', 'Fresh fruit display', 'Table runners & linen'],
    lighting: ['Fairy / string lights', 'Lanterns'], venue: ['Outdoor', 'Garden'],
  },
]
