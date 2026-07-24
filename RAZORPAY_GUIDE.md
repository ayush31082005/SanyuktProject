# Complete Razorpay Integration Guide

This guide explains how to use the newly implemented Razorpay flow, how to test it locally, and how to transition to production.

## 1. Backend Setup (.env)
Add the following to your `server/.env` file:
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here (optional for local)
```

## 2. Testing Webhooks Locally (ngrok)
Webhooks are essential for "recording payments" even if the user closes the tab.
1. Install [ngrok](https://ngrok.com/).
2. Run your server (e.g., on port 5001).
3. Start ngrok: `ngrok http 5001`.
4. Copy the `https` URL provided by ngrok (e.g., `https://1234-abcd.ngrok-free.app`).
5. Go to **Razorpay Dashboard > Settings > Webhooks**.
6. Add a new webhook:
   - **URL**: `https://1234-abcd.ngrok-free.app/api/payments/webhook`
   - **Events**: `payment.captured`, `payment.failed`.
   - **Secret**: Must match `RAZORPAY_WEBHOOK_SECRET` in your `.env`.

## 3. Why payments might not be recorded
- **Signature Verification**: Razorpay transactions remain "Authorized" until captured. Our backend `verify` call ensures they are captured and recorded in the database.
- **Async Failures**: If a user's browser crashes, the client-side `verify` call never happens. Webhooks (Step 2) fix this by updating the DB directly from Razorpay's servers.
- **Test Mode Toggle**: Ensure you are looking at the "Test Mode" toggle in the top-right of the Razorpay Dashboard.

## 4. Test Mode vs Live Mode
| Feature | Test Mode | Live Mode |
| :--- | :--- | :--- |
| **Purpose** | Development & Debugging | Real money transactions |
| **Key Prefix** | `rzp_test_...` | `rzp_live_...` |
| **Mock Page** | Shows success/failure buttons | Shows real bank selection/UPI |
| **Dashboard** | Data is separate from live data | Real business metrics |

## 5. Security Checklist
- [x] **Key Secret**: Never shared with the client. It only lives on the server.
- [x] **Signature Verification**: Every payment is verified using SHA256 HMAC before being marked as "captured".
- [x] **SSL/TLS**: Razorpay required `HTTPS` for all production communications.

---
### Manual Verification Steps
1. Open the recharge section on your site.
2. Select "Online Payment".
3. Use the **Razorpay Mock Bank Page** to click "Success".
4. Check your MongoDB `payments` collection to see the record updated to `captured`.
5. Check the Razorpay Dashboard (Test Mode) to see the payment marked as "Captured".
