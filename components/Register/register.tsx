// components/GoogleSignInButton.tsx
'use client';

import GoogleButton from 'react-google-button';

const GoogleSignInButton = () => {
  const handleClick = () => {
    window.location.href = 'http://localhost:5000/api/home/google'; 
  };
  return (
    <GoogleButton onClick={handleClick} />
  );
};

export default GoogleSignInButton;
