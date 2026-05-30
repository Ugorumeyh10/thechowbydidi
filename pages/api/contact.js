export default function handler(req, res) {
  res.status(200).json({
    whatsapp: process.env.WHATSAPP_NUMBER || '+2348000000000',
    email: 'hello@chowbydidihaus.com',
    instagram: '@chowbydidihaus'
  })
}
