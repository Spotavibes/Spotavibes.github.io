import express from 'express'
import Stripe from 'stripe'
import cors from 'cors'

const app = express()
const stripe = new Stripe('') // Replace with your actual secret key

app.use(cors())
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
          unit_amount: amount * 100, // Stripe amount is in cents
        },
        quantity: 1,
      }],
      success_url: 'http://localhost:5173/success', // Change if your frontend URL differs
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

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
