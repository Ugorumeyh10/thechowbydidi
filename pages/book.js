import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import BookingForm from '../components/BookingForm'
import ReceiptForm from '../components/ReceiptForm'
import { SERVICE_OPTIONS } from '../lib/content'

export default function Book() {
  const { query } = useRouter()
  const service = SERVICE_OPTIONS.includes(query.service) ? query.service : ''
  const type = ['enquiry', 'academy', 'voucher'].includes(query.type) ? query.type : 'enquiry'

  return (
    <>
      <Head>
        <title>Book · Chowby Didi Haus</title>
        <meta name="description" content="Book Chowby Didi Haus — tell us about your event and pay your deposit by bank transfer." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <Layout>
        <div className="page page--narrow">
          <div className="center">
            <div className="eyebrow">Secure Your Date</div>
            <h1 className="h1">Book an Experience</h1>
            <div className="rule" style={{ margin: '0 auto 8px' }} />
            <p className="lead">Tell us about your event — we’ll confirm availability within 24 hours.</p>
          </div>

          <section className="section">
            <BookingForm initialService={service} initialType={type} />
          </section>

          <section className="section" id="pay">
            <ReceiptForm />
          </section>
        </div>
      </Layout>
    </>
  )
}
