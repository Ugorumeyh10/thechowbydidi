import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const WA = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2347036791385').replace(/[^0-9]/g, '')
export const waLink = (msg) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(msg || 'Hi Chowby Didi Haus! I would like to enquire.')}`

const TABS = [
  { href: '/', label: 'Home', icon: IconHome },
  { href: '/menu', label: 'Menu', icon: IconMenu },
  { href: '/gallery', label: 'Gallery', icon: IconImage },
  { href: '/book', label: 'Book', icon: IconCalendar },
  { href: '/about', label: 'More', icon: IconDots },
]

const NAV = [
  ['/', 'Home'], ['/about', 'About'], ['/services', 'Services'],
  ['/menu', 'Menu'], ['/gallery', 'Gallery'], ['/academy', 'Academy'], ['/book', 'Book'],
]

export default function Layout({ children }) {
  const { pathname } = useRouter()
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  // Reveal-on-scroll: fade/slide sections in as they enter the viewport.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.section'))
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return (
    <div className="app reveal-on">
      <header className="appbar">
        <Link href="/" className="appbar__brand">
          <span className="appbar__logo">Chowby Didi Haus</span>
          <span className="appbar__tag">Made to Hit Different</span>
        </Link>
        <nav className="appbar__links">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className={isActive(href) ? 'active' : ''}>{label}</Link>
          ))}
        </nav>
        <Link href="/book" className="appbar__cta">Book</Link>
      </header>

      <main>{children}</main>

      <Footer />

      <a className="fab-wa" href={waLink()} target="_blank" rel="noopener" aria-label="WhatsApp">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="#fff"><path d="M16.04 4C9.93 4 4.98 8.95 4.98 15.06c0 1.96.51 3.86 1.49 5.55L4 28l7.6-2.42a11 11 0 0 0 4.44.93c6.11 0 11.06-4.95 11.06-11.06C27.1 8.95 22.15 4 16.04 4zm0 20.2c-1.37 0-2.71-.37-3.88-1.06l-.28-.16-4.51 1.44 1.46-4.4-.18-.29a9.1 9.1 0 0 1-1.4-4.86c0-5.06 4.12-9.18 9.18-9.18 2.45 0 4.76.96 6.49 2.69a9.1 9.1 0 0 1 2.69 6.49c0 5.06-4.12 9.19-9.18 9.19zm5.04-6.88c-.28-.14-1.63-.8-1.89-.9-.25-.09-.43-.14-.62.14-.18.28-.71.9-.87 1.08-.16.18-.32.21-.6.07-.28-.14-1.17-.43-2.22-1.37-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.35-.25.28-.96.94-.96 2.3 0 1.36.99 2.67 1.13 2.85.14.18 1.95 2.98 4.73 4.18.66.29 1.18.46 1.58.59.66.21 1.27.18 1.74.11.53-.08 1.63-.67 1.86-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.18-.53-.32z"/></svg>
      </a>

      <nav className="tabbar">
        {TABS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`tabbar__item ${isActive(href) ? 'active' : ''}`}>
            <Icon />
            <span>{label}</span>
            <span className="tabbar__dot" />
          </Link>
        ))}
      </nav>
    </div>
  )
}

function Footer() {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [msg, setMsg] = useState('')
  const subscribe = async () => {
    if (!email.includes('@')) { setMsg('Enter a valid email.'); return }
    setMsg('…')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, source: 'footer' }),
      })
      const j = await res.json()
      setMsg(res.ok ? (j.message || 'Subscribed!') : (j.error || 'Try again'))
      if (res.ok) setEmail('')
    } catch { setMsg('Could not subscribe.') }
  }
  return (
    <footer className="foot">
      <div className="foot__in">
        <div className="foot__cols">
          <div>
            <div className="foot__logo">Chowby Didi Haus</div>
            <p style={{ maxWidth: 360, marginTop: 10 }}>
              Elevated food experiences through luxury canapés, curated dining, and refined
              hospitality — rooted in Lagos, built for the world.
            </p>
            <div className="foot__nl">
              <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="hp" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} aria-hidden />
              <button onClick={subscribe}>Join</button>
            </div>
            {msg && <p style={{ fontSize: 12, marginTop: 8, color: 'rgba(255,255,255,0.7)' }}>{msg}</p>}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#fff', marginBottom: 10 }}>Explore</div>
            {NAV.slice(1).map(([href, label]) => (
              <div key={href} style={{ marginBottom: 8 }}><Link href={href}>{label}</Link></div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#fff', marginBottom: 10 }}>Contact</div>
            <div style={{ marginBottom: 8 }}><a href={waLink()} target="_blank" rel="noopener">WhatsApp Didi</a></div>
            <div style={{ marginBottom: 8 }}><a href="mailto:Chowbydidi@gmail.com">Chowbydidi@gmail.com</a></div>
            <div style={{ marginBottom: 8 }}>Lagos, Nigeria</div>
          </div>
        </div>
        <div className="foot__bottom">© {new Date().getFullYear()} Chowby Didi Haus · Lagos, Nigeria · All rights reserved</div>
      </div>
    </footer>
  )
}

/* ── icons ── */
function IconHome() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11l9-7 9 7" /><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" /></svg> }
function IconMenu() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h10" /></svg> }
function IconImage() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M21 16l-5-5L5 20" /></svg> }
function IconCalendar() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg> }
function IconDots() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></svg> }
