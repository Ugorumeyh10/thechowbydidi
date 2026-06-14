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
    name: 'Event Setup & Tablescape', from: 300000, img: '/media/event_spread.jpg',
    desc: 'Full tablescape design — tiered risers, fresh fruit arrangements, floral styling, ambient lighting and branded menu cards. Weddings, corporate events, brand activations.',
  },
  {
    name: 'Celebration Boxes', from: 80000, img: '/media/celebration_box_poster.jpg',
    desc: 'Branded food hampers — clear-lid kraft boxes, organza ribbons, custom tags and signature canapés & bakes. Valentine’s, Christmas, Eid, Corporate. Lagos delivery + shipping.',
  },
]

// Service options for the booking form
export const SERVICE_OPTIONS = [
  'Canapés & Cocktail Catering',
  'Private Dining',
  'Event Setup & Tablescape',
  'Celebration Boxes',
  'Didi Academy — Course',
  'Chef Consulting',
]

// "From" prices for the deposit calculator
export const SERVICE_FROM = {
  'Canapés & Cocktail Catering': 250000,
  'Private Dining': 300000,
  'Event Setup & Tablescape': 300000,
  'Celebration Boxes': 80000,
  'Didi Academy — Course': 5000,
  'Chef Consulting': 25000,
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
