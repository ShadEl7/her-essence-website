# Order Tracking Integration Guide

## Overview
This guide explains how to integrate the order tracking functionality into your existing H.E.R. clothing store website.

## Files Created/Modified

### 1. New Files Created:
- `pages/order-tracking.html` - Main order tracking page
- `pages/order-tracking-api.js` - Backend API for order tracking

### 2. Files Modified:
- `pages/contact.html` - Updated footer link to point to order tracking page

## Integration Steps

### Step 1: Update Your Main Server File

Add the following to your main `server.js` file:

```javascript
// Import the order tracking routes
const orderTrackingRoutes = require('./pages/order-tracking-api');

// Use the order tracking routes
app.use(orderTrackingRoutes);

// Make sure you have express.json() middleware for parsing JSON requests
app.use(express.json());
```

### Step 2: Database Integration

The current implementation uses mock data. To connect to your real database:

1. Replace the `mockOrders` object in `order-tracking-api.js` with database queries
2. Update the API endpoints to use your actual order management system
3. Connect to your Stripe checkout sessions (if using Stripe)

Example database integration:
```javascript
// Replace mockOrders lookup with database query
const order = await Order.findOne({ 
  orderNumber: orderNumber.toUpperCase(),
  email: email.toLowerCase() 
});
```

### Step 3: Environment Variables

Add these environment variables to your `.env` file:
```
# Order tracking settings
ORDER_TRACKING_ENABLED=true
DEFAULT_CARRIER=FedEx
TRACKING_API_KEY=your_shipping_carrier_api_key
```

### Step 4: Shipping Carrier Integration

For real-time tracking updates, integrate with shipping carriers:

#### FedEx Integration:
```javascript
const fedex = require('fedex-track');
// Add FedEx tracking API calls
```

#### DHL Integration:
```javascript
const dhl = require('dhl-tracking');
// Add DHL tracking API calls
```

### Step 5: Email Notifications

Set up automated email notifications for order status updates:

```javascript
const nodemailer = require('nodemailer');

async function sendTrackingUpdate(order, newStatus) {
  // Email configuration and sending logic
}
```

## API Endpoints

### POST /api/track-order
Track an order using order number and email.

**Request Body:**
```json
{
  "orderNumber": "HER-2025-001234",
  "email": "customer@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "HER-2025-001234",
    "status": "shipped",
    "orderDate": "2025-08-12",
    "total": 127.50,
    "tracking": {
      "carrier": "FedEx",
      "trackingNumber": "1234567890123456"
    }
  }
}
```

### GET /api/order-status/:orderNumber
Get basic order status (no authentication required).

### POST /api/tracking-updates
Get detailed tracking updates for an order.

## Testing

### Demo Data
The system includes demo orders for testing:

1. **Order #HER-2025-001234**
   - Email: customer@example.com
   - Status: Shipped

2. **Order #HER-2025-001235**
   - Email: jane.doe@email.com
   - Status: Delivered

### Test the Integration:

1. Start your server
2. Navigate to `/pages/order-tracking.html`
3. Click "Try Demo" button
4. Submit the form to test the API

## Security Considerations

1. **Rate Limiting**: Implement rate limiting on tracking API endpoints
2. **Email Verification**: Always verify email matches order before showing details
3. **Input Validation**: Validate all inputs to prevent injection attacks
4. **HTTPS**: Ensure all tracking requests use HTTPS
5. **Logging**: Log all tracking requests for security monitoring

## Customization Options

### 1. Order Number Format
Update the order number format in the JavaScript:
```javascript
// Current format: HER-2025-001234
// Customize in order-tracking.html
```

### 2. Status Colors
Modify the CSS status classes:
```css
.status-confirmed { background: #4caf50; }
.status-processing { background: #ff9800; }
.status-shipped { background: #2196f3; }
.status-delivered { background: #4caf50; }
```

### 3. Progress Steps
Add or modify tracking steps in the HTML and JavaScript.

## Troubleshooting

### Common Issues:

1. **"Order not found" errors**
   - Check order number format
   - Verify email address matches
   - Ensure database connection is working

2. **API not responding**
   - Check server.js integration
   - Verify routes are properly imported
   - Check network connectivity

3. **Tracking information not updating**
   - Verify shipping carrier API credentials
   - Check tracking number format
   - Review API rate limits

## Production Deployment

Before going live:

1. Remove demo functionality from order-tracking.html
2. Replace mock data with real database queries
3. Set up proper error logging
4. Configure email notifications
5. Test with real orders
6. Set up monitoring and alerts

## Support

For additional help integrating this system:
1. Check the API documentation
2. Review the demo implementation
3. Test with the provided demo data
4. Contact your development team for database integration

---

**Note**: This is a complete order tracking solution that integrates with your existing H.E.R. clothing store website. The system is designed to be scalable and can handle real customer orders once properly integrated with your database and shipping systems.
