const express = require('express');
const stripe = require('stripe')('your-secret-key-here'); // Replace with your Stripe secret key
const app = express();

app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { billingInfo, cartDetails } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartDetails.items.map(item => ({
        price_data: {
          currency: cartDetails.currency.toLowerCase(),
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'http://localhost:3000/confirmation.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/checkout.html',
      customer_email: billingInfo.email,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));