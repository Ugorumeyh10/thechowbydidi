// Serves /sitemap.xml. Set NEXT_PUBLIC_SITE_URL to your canonical domain.

const SECTIONS = ['', '#services', '#menu', '#private-dining', '#gift-shop', '#academy', '#book']

function generate(base) {
  const urls = SECTIONS.map((s) => `  <url><loc>${base}/${s}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export async function getServerSideProps({ res }) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://chowbydidihaus.com').replace(/\/$/, '')
  res.setHeader('Content-Type', 'text/xml')
  res.write(generate(base))
  res.end()
  return { props: {} }
}

export default function Sitemap() {
  return null
}
