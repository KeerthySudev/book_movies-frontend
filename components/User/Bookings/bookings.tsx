"use client"
import { useState, useEffect } from 'react';
import styles from './bookings.module.css';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/session', {
          credentials: 'include', // Ensure cookies/session are sent with the request
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data.authenticated._id);
        } else {
          console.error('Failed to fetch session data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };
    checkSession();
    async function fetchBookings() {
      try {
        console.log("userid", userId);
        const res = await fetch(`http://localhost:5000/api/user/bookings?userId=${encodeURIComponent(userId)}`);
        const data = await res.json();
        setBookings(data);
        console.log(bookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
    
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
  <div className={styles.bookingContainer}>
  <h1>Booking History</h1>
  {bookings.length > 0 ? (
    bookings.map((booking) => (
      <div key={booking._id} className={styles.bookingHistory}>
        <h2 className={styles.movieTitle}>{booking.movieDetails.title}</h2>
        <div className={styles.bookingDetails}>
          <div className={styles.detailItem}>
            <p>Booking ID:</p> {booking._id}
          </div>
          <div className={styles.detailItem}>
            <p>Booking Date:</p> {new Date(booking.bookingDate).toLocaleDateString()}
          </div>
          <div className={styles.detailItem}>
            <p>Seats:</p> {booking.seatIds.join(', ')}
          </div>
          <div className={styles.detailItem}>
            <p>Show Time:</p> {booking.showDetails.showdate} {booking.showDetails.showtime}
          </div>
          <div className={styles.detailItem}>
            <p>Theatre:</p> <span className={styles.theatreDetails}>{booking.theatreDetails.name}, {booking.theatreDetails.location}</span>
          </div>
          <div className={styles.detailItem}>
            <p>Total Price:</p> <span className={styles.totalPrice}>Rs {booking.totalPrice}</span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>No bookings found.</p>
  )}
</div>

  );
}

// Fetch userId from the URL
export async function getServerSideProps(context) {
  const { userId } = context.query;
  return { props: { userId } };
}
