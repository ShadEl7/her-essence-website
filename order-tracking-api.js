// Order Tracking API Endpoint
// This file should be integrated with your main server.js file

const express = require('express');
const router = express.Router();

// Mock database - In production, replace with your actual database
const mockOrders = {
  'HER-2025-001234': {
    id: 'HER-2025-001234',
    email: 'customer@example.com',
    status: 'shipped',
    orderDate: '2025-08-12',
    total: 127.50,
    currency: 'USD',
    shippingAddress: {
      street: '123 Fashion St',
      city: 'Style City',
      state: 'SC',
      zipCode: '12345'
    },
    items: [
      { name: 'Vintage Denim Jacket', size: 'M', quantity: 1, price: 89.99 },
      { name: 'Classic White Tee', size: 'S', quantity: 1, price: 37.51 }
    ],
    tracking: {
      carrier: 'FedEx',
      trackingNumber: '1234567890123456',
      estimatedDelivery: '2025-08-16',
      lastUpdate: 'Package is in transit - August 15, 2025 2:30 PM',
      updates: [
        {
          date: '2025-08-12 10:00 AM',
          status: 'Order confirmed',
          location: 'Processing Center'
        },
        {
          date: '2025-08-13 2:30 PM',
          status: 'Order processed and packaged',
          location: 'Fulfillment Center'
        },
        {
          date: '2025-08-14 8:45 AM',
          status: 'Package shipped',
          location: 'Windhoek, Namibia'
        },
        {
          date: '2025-08-15 2:30 PM',
          status: 'In transit',
          location: 'Regional Sorting Facility'
        }
      ]
    }
  },
  'HER-2025-001235': {
    id: 'HER-2025-001235',
    email: 'jane.doe@email.com',
    status: 'delivered',
    orderDate: '2025-08-10',
    total: 95.00,
    currency: 'USD',
    shippingAddress: {
      street: '456 Style Ave',
      city: 'Fashion Town',
      state: 'FT',
      zipCode: '67890'
    },
    items: [
      { name: 'Elegant Evening Dress', size: 'L', quantity: 1, price: 95.00 }
    ],
    tracking: {
      carrier: 'DHL',
      trackingNumber: '9876543210987654',
      estimatedDelivery: '2025-08-14',
      lastUpdate: 'Package delivered - August 14, 2025 3:15 PM',
      updates: [
        {
          date: '2025-08-10 11:30 AM',
          status: 'Order confirmed',
          location: 'Processing Center'
        },
        {
          date: '2025-08-11 1:15 PM',
          status: 'Order processed and packaged',
          location: 'Fulfillment Center'
        },
        {
          date: '2025-08-12 9:20 AM',
          status: 'Package shipped',
          location: 'Windhoek, Namibia'
        },
        {
          date: '2025-08-14 3:15 PM',
          status: 'Delivered',
          location: 'Fashion Town, FT'
        }
      ]
    }
  }
};

// Track order endpoint
router.post('/api/track-order', async (req, res) => {
  try {
    const { orderNumber, email } = req.body;

    // Validate input
    if (!orderNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'Order number and email are required'
      });
    }

    // Find order in mock database
    const order = mockOrders[orderNumber.toUpperCase()];

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found. Please check your order number.'
      });
    }

    // Verify email matches
    if (order.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: 'Email address does not match our records for this order.'
      });
    }

    // Return order details
    res.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        orderDate: order.orderDate,
        total: order.total,
        currency: order.currency,
        shippingAddress: order.shippingAddress,
        items: order.items,
        tracking: order.tracking
      }
    });

  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while tracking your order. Please try again later.'
    });
  }
});

// Get order status by order number (for quick lookups)
router.get('/api/order-status/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = mockOrders[orderNumber.toUpperCase()];

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Return basic status info (no sensitive data)
    res.json({
      success: true,
      orderNumber: order.id,
      status: order.status,
      lastUpdate: order.tracking.lastUpdate
    });

  } catch (error) {
    console.error('Error getting order status:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while checking order status.'
    });
  }
});

// Get tracking updates for an order
router.post('/api/tracking-updates', async (req, res) => {
  try {
    const { orderNumber, email } = req.body;

    const order = mockOrders[orderNumber.toUpperCase()];

    if (!order || order.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or email mismatch'
      });
    }

    res.json({
      success: true,
      updates: order.tracking.updates,
      carrier: order.tracking.carrier,
      trackingNumber: order.tracking.trackingNumber
    });

  } catch (error) {
    console.error('Error getting tracking updates:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving tracking updates.'
    });
  }
});

module.exports = router;
