import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const response = await fetch('http://localhost:5000/api/home/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('User found or created:', data.user);
          return true;
        } else {
          console.error('Error creating/finding user:', data.error);
          return false;
        }
      } catch (error) {
        console.error('Sign-in error:', error);
        return false;
      }
    },
    async session({ session, token, user }) {
      // Optionally fetch user data again in session if necessary
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);

// export const authOptions = {
//   providers: [
//         GoogleProvider({
//           clientId: process.env.GOOGLE_CLIENT_ID 
//           // || "756942842226-gttjt9mtb47orotn7anmcm4qfst39hl3.apps.googleusercontent.com"
//           ,
//           clientSecret: process.env.GOOGLE_CLIENT_SECRET 
//           // || "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"
          
//         }),
//       ],
//       callbacks: {
//             async session({ session, token, user }) {
//               // Store the access token in the session object
//               session.accessToken = token.accessToken;
//               return session;
//             },
//             async jwt({ token, user, account }) {
//                     // Save access token to JWT token
//                     if (account) {
//                       token.accessToken = account.access_token;
//                     }
//                     return token;
//                   }
//           },
        
//       secret : process.env.NEXTAUTH_SECRET,
      
// }
// const handler = NextAuth(authOptions);
// export {handler as GET, handler as POST }

