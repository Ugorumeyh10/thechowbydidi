import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { MENU } from '../lib/content'

export default function Menu() {
  return (
    <>
      <Head>
        <title>Menu · Chowby Didi Haus</title>
        <meta name="description" content="Signature canapés, grazing tables, fruit tablescapes and private dining menus from Chowby Didi Haus." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <Layout>
        <div className="page page--narrow">
          <div className="center">
            <div className="eyebrow">Tastes & Spreads</div>
            <h1 className="h1">Menu</h1>
            <div className="rule" style={{ margin: '0 auto 8px' }} />
            <p className="lead">Signature spreads, fully customisable to your event and guest count.</p>
          </div>

          <div className="card section" style={{ overflow: 'hidden' }}>
            <img src="/media/img1.jpg" alt="Signature canapés" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} loading="lazy" />
            <div style={{ padding: '6px 18px 18px' }}>
              <div className="menu-list">
                {MENU.map((m) => (
                  <div className="menu-row" key={m.name}>
                    <div>
                      <div className="menu-row__name">{m.name}</div>
                      <div className="menu-row__meta">{m.meta}</div>
                    </div>
                    <div className="menu-row__dots" />
                    <div className="menu-row__price">{m.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="center section">
            <Link href="/book" className="btn btn--auto">Request a Custom Menu</Link>
          </div>
        </div>
      </Layout>
    </>
  )
}
