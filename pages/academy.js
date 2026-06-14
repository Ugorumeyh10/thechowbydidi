import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
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
                <div className="menu-row" key={c.name}>
                  <div>
                    <div className="menu-row__name">{c.name}</div>
                    <div className="menu-row__meta">{c.meta}</div>
                  </div>
                  <div className="menu-row__dots" />
                  <div className="menu-row__price">{c.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="center section">
            <Link href="/book?type=academy&service=Didi%20Academy%20%E2%80%94%20Course" className="btn btn--auto">Enrol Now</Link>
          </div>
        </div>
      </Layout>
    </>
  )
}
