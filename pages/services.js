import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { SERVICES, naira } from '../lib/content'

export default function Services() {
  return (
    <>
      <Head>
        <title>Services · Chowby Didi Haus</title>
        <meta name="description" content="Canapés & cocktail catering, private dining, event setup & tablescape, and celebration boxes by Chowby Didi Haus." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <Layout>
        <div className="page">
          <div className="center">
            <div className="eyebrow">What We Do</div>
            <h1 className="h1">Services</h1>
            <div className="rule" style={{ margin: '0 auto 8px' }} />
            <p className="lead" style={{ maxWidth: 600, margin: '0 auto' }}>From intimate dinners to 500-guest celebrations — every service styled like art.</p>
          </div>

          <section className="tiles section">
            {SERVICES.map((s) => (
              <div key={s.name} className="card tile">
                <img className="tile__img" src={s.img} alt={s.name} loading="lazy" />
                <div className="tile__body">
                  <h3 className="tile__title">{s.name}</h3>
                  <div className="tile__price">From {naira(s.from)}</div>
                  <p className="tile__desc">{s.desc}</p>
                  <Link href={`/book?service=${encodeURIComponent(s.name)}`} className="btn" style={{ marginTop: 14 }}>Book this</Link>
                </div>
              </div>
            ))}
          </section>

          <section className="section card" style={{ padding: 22 }}>
            <h2 className="h2">Also available</h2>
            <p className="lead">Didi Academy courses & 1-on-1 chef consulting — see <Link href="/academy" style={{ color: 'var(--crimson)' }}>Academy</Link>. A non-refundable 50% deposit secures your date.</p>
          </section>
        </div>
      </Layout>
    </>
  )
}
