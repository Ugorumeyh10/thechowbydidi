import Head from 'next/head'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'

export default function About() {
  const [imgOk, setImgOk] = useState(true)
  const imgRef = useRef(null)
  // Catch the case where the image already 404'd during SSR before React
  // attached onError (naturalWidth === 0 means it failed to load).
  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth === 0) setImgOk(false)
  }, [])
  return (
    <>
      <Head>
        <title>About · Chowby Didi Haus</title>
        <meta name="description" content="Meet Blessing Christopher David — founder & executive chef of Chowby Didi Haus, known as the Picasso of the kitchen." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <Layout>
        <div className="page page--narrow">
          <div className="center">
            <div className="eyebrow">The Artist Behind the Plate</div>
            <h1 className="h1">Meet Chef Blessing</h1>
            <div className="rule" style={{ margin: '0 auto 8px' }} />
          </div>

          <section className="ceo section">
            {imgOk
              ? <img ref={imgRef} className="ceo__photo" src="/media/ceo.jpg" alt="Blessing Christopher David, Founder & Executive Chef" onError={() => setImgOk(false)} onLoad={(e) => { if (e.currentTarget.naturalWidth === 0) setImgOk(false) }} />
              : <div className="ceo__mono"><span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}><span>BCD</span><span style={{ fontSize: 13, fontStyle: 'normal', letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Chef Blessing</span></span></div>}
            <div>
              <div className="eyebrow">Founder & Executive Chef</div>
              <h2 className="h2" style={{ marginTop: 6 }}>Blessing Christopher David</h2>
              <p className="lead">
                Affectionately called <strong>“the Picasso”</strong> by clients and peers, Blessing Christopher David
                treats every event like a blank canvas. Where others see catering, she sees composition — colour,
                texture, balance and drama plated with the eye of an artist and the discipline of a chef.
              </p>
              <p className="quote">“If it doesn’t look like art and taste even better, it doesn’t leave my kitchen.”</p>
              <p className="lead">
                From a single canapé platter to fully styled 500-guest tablescapes, Blessing built Chowby Didi Haus on
                one promise: food <em>made to hit different</em> — as unforgettable on the palate as it is to the eye.
              </p>
            </div>
          </section>

          <section className="section card" style={{ padding: 22 }}>
            <div className="eyebrow">The House</div>
            <h2 className="h2" style={{ marginTop: 6 }}>Chowby Didi Haus</h2>
            <p className="lead">
              Chowby Didi Haus is a Lagos-born luxury food and hospitality studio creating elevated experiences
              through gourmet canapés, curated private dining, breathtaking event setups and signature celebration
              boxes. Rooted in Lagos and built for the world, every detail — from florals and linen to lighting and
              plating — is intentional and immaculate.
            </p>
            <div className="stats" style={{ marginTop: 18 }}>
              <div><div className="stat__n">500+</div><div className="stat__l">Guests Served</div></div>
              <div><div className="stat__n">200+</div><div className="stat__l">Events Styled</div></div>
              <div><div className="stat__n">5★</div><div className="stat__l">Client Rating</div></div>
            </div>
          </section>

          <section className="section center">
            <Link href="/book" className="btn btn--auto">Work With Chef Blessing</Link>
          </section>
        </div>
      </Layout>
    </>
  )
}
