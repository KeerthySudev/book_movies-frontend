import ShowMovies from "@/components/User/Movie/movie";
import Bookings from "@/components/User/Bookings/bookings";
import Navbar from "@/components/User/Layout/Navbar/navbar";

export default function Home() {
  return (
    <main>
     <Navbar/>
     <Bookings/>
    </main>
  );
}
