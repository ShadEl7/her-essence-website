const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simulate payment session creation
app.post('/create-checkout-session', (req, res) => {
  const { billingInfo, cartDetails, paymentMethod, paymentDetails } = req.body;

  // Validate required fields
  if (!billingInfo || !cartDetails || !paymentMethod) {
    return res.json({ error: 'Missing required information.' });
  }

  // Simulate different payment flows
  if (paymentMethod === 'card') {
    // Here you would integrate with Stripe or another card processor
    if (!paymentDetails.cardNumber || !paymentDetails.cardExpiry || !paymentDetails.cardCVC) {
      return res.json({ error: 'Missing card details.' });
    }
    // Simulate success
    return res.json({ success: true });
  } else if (paymentMethod === 'paypal') {
    // Here you would create a PayPal payment and return the approval URL
    return res.json({ paypalUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=EXAMPLE' });
  } else if (paymentMethod === 'mobile') {
    // Here you would integrate with a mobile money API
    if (!paymentDetails.mobileNumber || !paymentDetails.provider) {
      return res.json({ error: 'Missing mobile money details.' });
    }
    // Simulate redirect to mobile money payment page
    return res.json({ mobileMoneyUrl: 'https://mobilemoney.example.com/pay?ref=ORDER123' });
  } else {
    return res.json({ error: 'Unsupported payment method.' });
  }
});

app.listen(3000, () => {
  console.log('Payment backend running on http://localhost:3000');
});