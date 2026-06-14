import Head from 'next/head'
import Link from 'next/link'
import Layout, { waLink } from '../components/Layout'

const PRICE = '$70'
const BOOK = {
  title: 'What You Never Knew About Jollof Rice',
  tagline: 'The smoky party jollof — and the foil-paper secret behind it.',
  cover: '/media/ebook_cover.jpg',
  preview: '/ebooks/jollof-preview.pdf',
  inside: [
    'The story behind party jollof',
    'Three things you never knew before you cook',
    'Full ingredient guide',
    'Step-by-step smoky jollof with the foil-paper method',
    'Perfect boiled eggs to serve',
    'Chef Blessing’s notes for getting it right every time',
  ],
}
const ORDER_MSG = `Hi Chowby Didi Haus! I'd like to buy the culinary e-book "${BOOK.title}" for ${PRICE}.`

export default function Ebooks() {
  return (
    <>
      <Head>
        <title>Culinary E-Books · Chowby Didi Haus</title>
        <meta name="description" content="Chowby Didi Haus culinary e-books — learn the secrets behind smoky party jollof and more. From $70." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta property="og:image" content="/media/ebook_cover.jpg" />
      </Head>
      <Layout>
        <div className="page">
          <div className="center">
            <div className="eyebrow">The Kitchen, In Your Hands</div>
            <h1 className="h1">Culinary E-Books</h1>
            <div className="rule" style={{ margin: '0 auto 8px' }} />
            <p className="lead" style={{ maxWidth: 600, margin: '0 auto' }}>
              The recipes, techniques and secrets behind the Chowby Didi Haus kitchen — beautifully written,
              ready to cook from.
            </p>
          </div>

          {/* Featured book */}
          <section className="section">
            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr', overflow: 'hidden' }}>
              <div className="ebook-grid">
                <div style={{ background: 'var(--cream)', padding: 22, display: 'flex', justifyContent: 'center' }}>
                  <img src={BOOK.cover} alt={BOOK.title} style={{ width: '100%', maxWidth: 320, borderRadius: 10, boxShadow: 'var(--shadow-lg)' }} />
                </div>
                <div style={{ padding: '24px 22px' }}>
                  <div className="eyebrow">New Release · E-Book (PDF)</div>
                  <h2 className="h2" style={{ marginTop: 6 }}>{BOOK.title}</h2>
                  <p className="lead" style={{ fontSize: 15 }}>{BOOK.tagline}</p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '14px 0' }}>
                    <span className="app-serif" style={{ fontSize: 40, color: 'var(--gold)', fontWeight: 700 }}>{PRICE}</span>
                    <span style={{ color: 'var(--soft)', fontSize: 13 }}>instant PDF · cook from any device</span>
                  </div>

                  <a className="btn btn--wa" href={waLink(ORDER_MSG)} target="_blank" rel="noopener">Buy on WhatsApp — {PRICE}</a>
                  <Link className="btn" href="/book#pay" style={{ marginTop: 10 }}>Pay by transfer & upload receipt</Link>
                  <a className="btn btn--ghost" href={BOOK.preview} target="_blank" rel="noopener" style={{ marginTop: 10 }}>Read a free preview</a>

                  <p className="note">After payment we email your e-book to you within 24 hours.</p>
                </div>
              </div>

              <div style={{ padding: '4px 22px 24px', borderTop: '1px solid var(--line)' }}>
                <h3 className="app-serif" style={{ fontSize: 18, margin: '16px 0 10px' }}>What’s inside</h3>
                <div className="inside-grid">
                  {BOOK.inside.map((t) => (
                    <div key={t} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14, color: 'var(--ink)' }}>
                      <span style={{ color: 'var(--gold)' }}>✦</span><span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="section center">
            <div className="eyebrow">More Coming Soon</div>
            <h2 className="h2">A whole collection in the works</h2>
            <p className="lead" style={{ maxWidth: 520, margin: '0 auto 16px' }}>
              Canapés, grazing tables, party classics and more — straight from Chef Blessing’s kitchen.
              Join the list to hear first.
            </p>
            <Link href="/book" className="btn btn--auto">Get in Touch</Link>
          </section>
        </div>

        <style jsx>{`
          .ebook-grid { display: grid; grid-template-columns: 1fr; }
          .inside-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
          @media (min-width: 760px) {
            .ebook-grid { grid-template-columns: 0.9fr 1.1fr; }
            .inside-grid { grid-template-columns: 1fr 1fr; }
          }
        `}</style>
      </Layout>
    </>
  )
}
