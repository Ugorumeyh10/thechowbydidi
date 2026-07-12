import Head from 'next/head'
import Layout, { waLink } from '../components/Layout'
import { COURSES } from '../lib/content'

export default function Academy() {
  return (
    <>
      <Head>
        <title>Academy · Chowby Didi Haus</title>
        <meta name="description" content="Didi Academy — masterclasses in canapés, event styling, gourmet cooking and catering business." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <Layout>
        <div className="page page--narrow">
          <div className="center">
            <div className="eyebrow">Learn From the Picasso</div>
            <h1 className="h1">Didi Academy</h1>
            <div className="rule" style={{ margin: '0 auto 8px' }} />
            <p className="lead">Online masterclasses & live workshops. Virtual access for the diaspora, certificates on completion.</p>
          </div>

          <div className="card section" style={{ padding: '6px 18px 18px' }}>
            <div className="menu-list">
              {COURSES.map((c) => (
                <a className="menu-row" key={c.name} href={waLink(`Hi Chowby Didi Haus! I'd like to enrol in "${c.name}" (${c.price}).`)} target="_blank" rel="noopener" style={{ cursor: 'pointer' }}>
                  <div>
                    <div className="menu-row__name">{c.name}</div>
                    <div className="menu-row__meta">{c.meta}</div>
                  </div>
                  <div className="menu-row__dots" />
                  <div className="menu-row__price">{c.price}</div>
                </a>
              ))}
            </div>
          </div>
          <p className="note center">Tap a course to enrol via WhatsApp.</p>

          <div className="center section">
            <a href={waLink('Hi Chowby Didi Haus! I’d like to enrol in Didi Academy.')} target="_blank" rel="noopener" className="btn btn--wa btn--auto">Enrol on WhatsApp</a>
          </div>
        </div>
      </Layout>
    </>
  )
}
