"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
    const seatIDs = searchParams.get('seatIDs');
    const showId = searchParams.get('showID');
    const amount = searchParams.get('total');
    const userId = '66dfe95bf56a51458f4ff32b';

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            resolve(true);
          };
          script.onerror = () => {
            resolve(false);
          };
          document.body.appendChild(script);
        });
      };

  useEffect(() => {
    loadRazorpayScript();
    if (seatIDs && showId && amount) {
      // Call backend API to create Razorpay order
      fetch('http://localhost:5000/api/user/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: Number(amount),
            seats: seatIDs.split(",").map(seat => seat.trim()),
            showId,
            userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Proceed with Razorpay checkout using data from backend (order ID, amount)
          const options = {
            key: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
            amount: data.order.amount, // Amount from Razorpay
            currency: data.order.currency,
            name: 'Movie Ticket Booking',
            description: 'Booking Tickets',
            order_id: data.order.id, // Razorpay order ID
            handler: function (response) {
              // Handle success and pass payment info to server
              handlePaymentSuccess(response, seatIDs, showId);
            },
            prefill: {
              name: 'User Name',
              email: 'user@example.com',
            },
            theme: {
              color: '#F37254',
            },
          };

          const razorpay = new (window as any).Razorpay(options); // TypeScript fix here
            razorpay.open();
        });
    }
  }, [seatIDs, amount]);

  const handlePaymentSuccess = (response: any, seats: string, showId: string) => {
    // Post payment success data to your backend for confirmation
    fetch('http://localhost:5000/api/user/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        seats,
        showId,
        userId
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert('Payment successful!');
          // Redirect to booking confirmation or ticket page
          router.push('/user/movies');
        } else {
          alert('Payment failed!');
        }
      });
  };

  return <div>Proceeding with Payment...</div>;
};

export default PaymentPage;
