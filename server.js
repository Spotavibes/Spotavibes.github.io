import express from 'express'
import Stripe from 'stripe'
import cors from 'cors'

const app = express()

// Replace with your actual secret key
const stripe = new Stripe('INSERT STRIPE KEY HERE') 

app.use(cors({
  origin: 'http://localhost:5173'  // frontend origin
}))
app.use(express.json())

app.post('/create-checkout-session', async (req, res) => {
  const { artistId, userId, amount } = req.body

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Investment in Artist #${artistId}` },
          unit_amount: amount * 100, // amount in cents
        },
        quantity: 1,
      }],
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
      metadata: {
        artistId: artistId.toString(),
        userId: userId.toString(),
      },
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// Fixed port, no dynamic port allocation
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
