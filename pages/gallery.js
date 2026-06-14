import Head from 'next/head'
import Layout from '../components/Layout'
import { GALLERY } from '../lib/content'

export default function Gallery() {
  return (
    <>
      <Head>
        <title>Gallery · Chowby Didi Haus</title>
        <meta name="description" content="A look at Chowby Didi Haus — canapés, fruit tablescapes and styled grazing tables." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <Layout>
        <div className="page">
          <div className="center">
            <div className="eyebrow">Our Work</div>
            <h1 className="h1">Gallery</h1>
            <div className="rule" style={{ margin: '0 auto 8px' }} />
            <p className="lead" style={{ maxWidth: 560, margin: '0 auto' }}>Real events, real spreads — styled by Chef Blessing.</p>
          </div>

          <div className="gallery section">
            {GALLERY.map((g, i) =>
              g.type === 'video' ? (
                <video key={i} src={g.src} poster={g.poster} controls playsInline muted loop preload="metadata" />
              ) : (
                <img key={i} src={g.src} alt={g.alt} loading="lazy" />
              )
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}
