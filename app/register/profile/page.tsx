
import OtpVerificationPage from "@/components/Register/VerifyEmail/verifyEmail";

export default function Home() {
  return (
    <main>
     <OtpVerificationPage/>
    </main>
  );
}











// 'use client';

// import { useEffect, useState } from 'react';

// const Profile = () => {
//   const [user, setUser] = useState<{ name: string; email: string } | null>(null);

//   useEffect(() => {
//     fetch('http://localhost:5000/auth/profile', {
//       credentials: 'include',
//     })
//       .then(response => response.json())
//       .then(data => setUser(data))
//       .catch(err => console.error(err));
//   }, []);

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Profile</h1>
//       <p>Name: {user.name}</p>
//       <p>Email: {user.email}</p>
//     </div>
//   );
// };

// export default Profile;
