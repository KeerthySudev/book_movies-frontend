'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './verifyEmail.module.css';

const OtpVerificationPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/session', {
          credentials: 'include', // Ensure cookies/session are sent with the request
        });

        if (response.ok) {
          const data = await response.json();
          setEmail(data.authenticated.email);
          console.log(data.authenticated.email)
        } else {
          console.error('Failed to fetch session data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };
    checkSession();
    
  }, [email]);

  // Function to handle sending OTP
  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/home/emailVerify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('OTP sent successfully! Please check your email.');
        setMessageType('success');
      } else {
        setMessage('Error sending OTP. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Error sending OTP. Please try again.');
      setMessageType('error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Function to handle verifying OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!otp) {
      setMessage('OTP is required');
      setMessageType('error');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setMessage('OTP must be a 6-digit number');
      setMessageType('error');
      return;
    }

    setIsVerifyingOtp(true);
    setMessage(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/home/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({otp }),
      });

      if (response.ok) {
        setMessage('OTP verified successfully!');
        setMessageType('success');
        router.push('/user/movies');
      } else {
        setMessage('Invalid OTP. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Error verifying OTP. Please try again.');
      setMessageType('error');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>OTP Verification</h1>
      <p className={styles.title}>Verify Your Email - {email}</p>

        <button
          onClick={handleSendOtp}
          disabled={isSendingOtp}
          className={`${styles.button} ${isSendingOtp ? styles.disabledButton : ''}`}
        >
          {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
        </button>

        <form onSubmit={handleVerifyOtp}>
          <div className={styles.formGroup}>
          <label htmlFor="otp" className={styles.label}>Enter OTP:</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              className={styles.input}            />
          </div>
          {message && <p className={messageType === 'success' ? styles.successMessage : styles.errorMessage}>{message}</p>}
          <button
            type="submit"
            disabled={isVerifyingOtp}
            className={`${styles.button} ${isVerifyingOtp ? styles.disabledButton : ''}`}
            >
            {isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>
        
      </div>
  );
};

export default OtpVerificationPage;
