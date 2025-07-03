// server.js
import express from 'express'
import Stripe from 'stripe'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
dotenv.config()

const app = express()

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15'
})

// Initialize Supabase with SERVICE_ROLE key
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Simple CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// ─── Route: Stripe Webhook ────────────────────────────────────────────────
// Must come before any body-parser middleware to get raw buffer
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature']
    let event

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error('⚠️  Webhook signature verification failed.', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('✅ checkout.session.completed:', session.id)

      const user_id           = session.metadata.userId
      const email        = session.metadata.userEmail
      const artist_id         = session.metadata.artistId
      const amount_bought     = 1
      const cost              = session.amount_total / 100
      const stripe_session_id = session.id
      const timestamp         = new Date(session.created * 1000).toISOString()

      try {
        const { error } = await supabase
          .from('transactions')
          .insert([{
            user_id,
            artist_name: artist_id,
            amount_bought,
            cost,
            stripe_session_id,
            timestamp,
            email
          }])

        if (error) {
          console.error('Supabase insert error:', error)
          return res.status(500).send('Supabase insert error')
        }

        console.log('💾 Transaction saved for user', user_id)
      } catch (err) {
        console.error('Webhook handler error:', err)
        return res.status(500).send('Webhook handler error')
      }
    }

    // Acknowledge receipt of the event
    res.json({ received: true })
  }
)

// Parse JSON bodies for all other routes
app.use(express.json())

// Helper to verify Supabase JWT & return the user
async function getUserFromToken(req) {
  const auth = req.headers.authorization || ''
  if (!auth.startsWith('Bearer ')) return null
  const token = auth.split(' ')[1]

  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token)

  if (error) {
    console.error('Supabase token verification error:', error)
    return null
  }
  return user
}

// ─── Route: Create Checkout Session ─────────────────────────────────────
app.post('/create-checkout-session', async (req, res) => {
  console.log('POST /create-checkout-session called')

  // 1) Verify the token & get user
  const user = await getUserFromToken(req)
  if (!user) {
    return res.status(401).json({ error: 'Invalid or missing Supabase auth token' })
  }

  // 2) Pull in artistId & amount from the body
  const { artistId, amount } = req.body
  if (!artistId || !amount) {
    return res.status(400).json({ error: 'Missing artistId or amount' })
  }

  try {
    // 3) Create the Stripe Checkout Session with verified user.id
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Investment in Artist #${artistId}` },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
      customer_email: user.email,
      metadata: {
        artistId: artistId.toString(),
        userId:   user.id,
        userEmail: user.email
      },
    })

    console.log('Stripe session created:', session.id)
    return res.json({ url: session.url })

  } catch (error) {
    console.error('Error in /create-checkout-session:', error)
    return res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
