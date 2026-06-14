import '../styles/globals.css'
import Head from 'next/head'
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  // Privacy-friendly analytics — only loads if NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set.
  // Free at https://plausible.io (or self-host). No cookies, GDPR-friendly.
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  return (
    <>
      <Head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://chowbydidihaus.com'} />
      </Head>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
      <Component {...pageProps} />
    </>
  )
}
