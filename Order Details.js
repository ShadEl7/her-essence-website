app.get('/order-details', async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items.data.price.product'],
    });

    const order = {
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      items: session.line_items.data.map(item => ({
        name: item.price.product.name,
        quantity: item.quantity,
      })),
    };

    res.json(order);
  } catch (error) {
    console.error('Error retrieving order details:', error);
    res.status(500).json({ error: error.message });
  }
});