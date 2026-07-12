import Head from 'next/head'
import Link from 'next/link'
import Layout, { waLink } from '../components/Layout'
import { SERVICES, naira } from '../lib/content'

export default function Home() {
  return (
    <>
      <Head>
        <title>Chowby Didi Haus — Made to Hit Different</title>
        <meta name="description" content="Luxury canapés, private dining, event setups and celebration boxes — Lagos to the world. Chowby Didi Haus creates elevated food experiences." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta property="og:title" content="Chowby Didi Haus" />
        <meta property="og:description" content="Made to Hit Different. Luxury canapés, private dining & event setups — Lagos to the world." />
        <meta property="og:image" content="/media/jollof_finished.jpg" />
        <meta name="theme-color" content="#f7f4f0" />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FoodEstablishment', name: 'Chowby Didi Haus',
          description: 'Elevated food experiences — luxury canapés, private dining, event setups and celebration boxes in Lagos.',
          servesCuisine: ['Nigerian', 'Continental', 'Canapés'], areaServed: 'Lagos, Nigeria',
          address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
          email: 'Chowbydidi@gmail.com', priceRange: '₦₦₦',
          founder: { '@type': 'Person', name: 'Blessing Christopher David', jobTitle: 'Founder & Executive Chef' },
        }) }} />
      </Head>

      <Layout>
        <div className="page">
          {/* Hero */}
          <section className="hero">
            <img className="hero__media" src="/media/jollof_finished.jpg" alt="Chowby Didi Haus signature smoky jollof rice" />
            <div className="hero__overlay">
              <div className="eyebrow">Lagos · Luxury Catering</div>
              <h1 className="hero__title">Made to<br />Hit Different</h1>
              <p className="hero__sub">Luxury canapés, curated private dining and breathtaking event tablescapes.</p>
              <div className="hero__btns">
                <Link href="/book" className="btn btn--auto">Book an Experience</Link>
                <a href={waLink()} className="btn btn--ghost btn--auto" target="_blank" rel="noopener" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>WhatsApp Us</a>
              </div>
            </div>
          </section>

          {/* Intro */}
          <section className="section center">
            <div className="eyebrow">Chowby Didi Haus</div>
            <h2 className="h2">Food, turned into living art</h2>
            <div className="rule" />
            <p className="lead" style={{ maxWidth: 620, margin: '0 auto' }}>
              Founded by executive chef <Link href="/about" style={{ color: 'var(--crimson)' }}>Blessing Christopher David</Link> —
              known as “the Picasso” for the artistry she brings to every plate — Chowby Didi Haus turns
              gatherings into unforgettable, beautifully styled experiences.
            </p>
          </section>

          {/* Services */}
          <section className="section">
            <div className="section__head center">
              <div className="eyebrow">What We Do</div>
              <h2 className="h2">Our Signature Services</h2>
              <div className="rule" style={{ margin: '12px auto' }} />
            </div>
            <div className="tiles">
              {SERVICES.map((s) => (
                <Link href="/services" key={s.name} className="card tile">
                  <img className="tile__img" src={s.img} alt={s.name} loading="lazy" />
                  <div className="tile__body">
                    <h3 className="tile__title">{s.name}</h3>
                    <div className="tile__price">From {naira(s.from)}</div>
                    <p className="tile__desc">{s.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="section card" style={{ padding: '24px 18px' }}>
            <div className="stats">
              <div><div className="stat__n">500+</div><div className="stat__l">Guests Served</div></div>
              <div><div className="stat__n">200+</div><div className="stat__l">Events Styled</div></div>
              <div><div className="stat__n">5★</div><div className="stat__l">Client Rating</div></div>
            </div>
          </section>

          {/* CTA */}
          <section className="section center">
            <h2 className="h2">Ready to create something extraordinary?</h2>
            <p className="lead" style={{ maxWidth: 520, margin: '0 auto 18px' }}>Tell us about your event — we’ll confirm availability within 24 hours.</p>
            <Link href="/book" className="btn btn--auto">Start Your Booking</Link>
          </section>
        </div>
      </Layout>
    </>
  )
}
