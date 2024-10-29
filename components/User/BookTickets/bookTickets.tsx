"use client";

import styles from './bookTickets.module.css';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'; 

export default function BookingSummary() {
  const router = useRouter();
    const searchParams = useSearchParams();
    const seatIDs = searchParams.get('seatIDs');
    // ?.split(',');
    const showId = searchParams.get('showID');
    const movie = searchParams.get('movie');
    const theatre = searchParams.get('theatre');
    const showtime = searchParams.get('showtime');
    const showdate = searchParams.get('showdate');
    const totalPrice = searchParams.get('total');
    const [userId, setUserId] = useState('');
    const [seats, setSeats] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState('+916282571196');
    const [authenticated, setAuthenticated] = useState('');


    useEffect(() => {
        const checkSession = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/session', {
              credentials: 'include', 
            });
    
            if (response.ok) {
              const data = await response.json();
              setAuthenticated(data.authenticated);
              setUserId(data.authenticated._id);
              console.log(data);
            } else {
              console.error('Failed to fetch session data:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching session data:', error);
          }
        };
        checkSession();
  
    }, []);

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


      const handleSendMessage = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/user/send-whatsapp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber, movie, seatIDs, theatre, showtime, showdate, totalPrice}),
          });
          
          const data = await res.json();
          console.log('Server response:', data); // Log server response for debugging
      
          if (data.success) {
            alert('Message sent successfully!');
          } else {
            alert('Failed to send message.');
          }
        } catch (error) {
          console.error('Error sending message:', error);
          alert('Error sending message.');
        }
      
    };

      const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        loadRazorpayScript();
        if (seatIDs && showId && totalPrice) {
          // Call backend API to create Razorpay order
          fetch('http://localhost:5000/api/user/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: Number(totalPrice),
                seats: seatIDs.split(",").map((seat: string) => seat.trim()),
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
                handler: function (response: any) {
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
      }
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
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert('Payment successful!');
              handleSendMessage();
              router.push('/user/movies');
            } else {
              alert('Payment failed!');
            }
          });
      };


    

      const handleClick = () => {
        alert('Sign in first to book a show!');
        window.location.href = 'http://localhost:5000/api/home/google'; 
      };
  return (
    <main>
      <div className={styles.receiptContainer}>
      <h2 className={styles.title}>Booking Receipt</h2>
      <div className={styles.receiptDetails}>
        <p>
          <strong>Seat IDs:</strong> {seatIDs}
        </p>
        <p>
          <strong>Movie:</strong> {movie}
        </p>
        <p>
          <strong>Theatre:</strong> {theatre}
        </p>
        <p>
          <strong>Showtime:</strong> {showdate} {showtime}
        </p>
        <p>
          <strong>Total Price:</strong> ₹{totalPrice}
        </p>
        <label>Phone Number (including country code):</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            readOnly
          />
      </div>
      {!authenticated ? (
       <div>
       <button onClick={handleClick} className={styles.payButton}>Pay</button>
     </div>
            
          ) : <button onClick={handlePayment} className={styles.payButton}>
          Pay
        </button>}


      
    </div>
    </main>
  );
}
