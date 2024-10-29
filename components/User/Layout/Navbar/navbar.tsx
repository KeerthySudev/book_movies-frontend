"use client";

import styles from './navbar.module.css';
import React, { useState, useEffect, ReactHTMLElement } from "react";
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState('');
  // const[word, setWord] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/session', {
          credentials: 'include', // Ensure cookies/session are sent with the request
        });

        if (response.ok) {
          const data = await response.json();
          setAuthenticated(data.authenticated);
        } else {
          console.error('Failed to fetch session data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };
    checkSession();
  }, []);

  const handleClick = () => {
    window.location.href = 'http://localhost:5000/api/home/google'; 
  };
  const handleLogout = async () => {
    try {
      // Call the backend logout route
      const response = await fetch('http://localhost:5000/api/home/logout', {
        method: 'GET',
        credentials: 'include', // Make sure cookies are included in the request
      });
  
      if (response.ok) {
        window.alert('Logged out successfully');
        router.push('http://localhost:3000'); // Redirect to the home or login page after logout
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
    <div>
    <div className={styles.navbar}>
<div className={styles.logo}>
  <img src='/images/logo3.png' alt='logo'></img>
  <h4>Book Movies</h4>
  
</div>
<div className={styles.movies}>
          <button><a href="/user/movies">Movies</a></button>
        </div>
{!authenticated ? (
            <div className={styles.signin}>
              <button onClick={handleClick}>Sign In</button>
            </div>
          ) : <><div className={styles.booking}>
          <button><a href="/user/bookings">Booking history</a></button>
        </div><br />
        <div className={styles.signin}>
          <button onClick={handleLogout}>Log out</button>
        </div></>}
</div>
    </div>
    
       
        </>
  );
};

export default Navbar;
