const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const { amount, currency = 'inr', paymentMethodId, savePaymentMethod } = req.body;

  try {
    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects the amount in cents
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      setup_future_usage: savePaymentMethod ? 'off_session' : null,
    });

    res.status(200).json({ paymentIntent, success: true });
  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    res.status(500).json({ message: 'Payment failed', error });
  }
};

const getPaymentHistory = async (req, res) => {
  const customerId = req.user.stripeCustomerId; // Assuming `stripeCustomerId` is stored in the user model

  try {
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 10, // Fetch last 10 payments
    });

    res.status(200).json({ payments: paymentIntents.data });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
};

module.exports = { createPaymentIntent, getPaymentHistory };
