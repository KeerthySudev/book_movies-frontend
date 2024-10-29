"use client";

import styles from './seatings.module.css';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'; 

const Seatings: React.FC<{ showId: string }> = ({ showId }) => {
  const [seatsByRow, setSeatsByRow] = useState<{ [key: string]: any[] }>({});
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);
  const [seats, setSeats] = useState([]);
  const [details, setDetails] = useState();
  const [theatre, setTheatre] = useState();
  const [movie, setMovie] = useState();
  const [showdate, setShowdate] = useState();
  const [showtime, setShowtime] = useState();
  const [seatCount, setSeatCount ] = useState(1);
  const params = useParams();
  const { id } = params;
  const totalPrice = seatCount * details;




  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/getSeatings?id=${encodeURIComponent(id)}`);
        const data = await response.json();

        const groupedSeats = data.seats.reduce((acc: { [key: string]: any[] }, seat: any) => {
          const row = seat.seatId.charAt(0); 
          if (!acc[row]) {
            acc[row] = [];
          }
          acc[row].push(seat);
          return acc;
        }, {});
        setDetails(data.price);
        setSeats(data.seats);
        setSeatsByRow(groupedSeats);
        setTheatre(data.theatre.name);
              setMovie(data.movie.title);
              setShowtime(data.showtime);
              setShowdate(data.showdate);

      } catch (error) {
        console.error('Failed to fetch seats:', error);
      }
    };

    fetchSeats();

  }, [id]);


  
  const handleSaveSeats = () => {
    setShowModal(false);
  };

  function handleSeatClick(seatId: string) {
    // If the seat is already selected, deselect it
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prevSelectedSeats =>
        prevSelectedSeats.filter(seat => seat !== seatId)
      );
      return;
    }

    // Check if maximum seat count is reached
    if (selectedSeats.length >= seatCount) {
      return;
    }

    // Automatically select nearby seats if the count is greater than 1
    if (seatCount > 1) {
      selectNearbySeats(seatId);
    } else {
      setSelectedSeats(prevSelectedSeats => [...prevSelectedSeats, seatId]);
    }
  }

  function selectNearbySeats(seatId: string) {
    // Grouping seats by row and columns
    const rowLetter = seatId.charAt(0);
    const rowSeats = seatsByRow[rowLetter] || [];

    const seatIndex = rowSeats.findIndex(seat => seat.seatId === seatId);
    if (seatIndex === -1) return;

    // Determine seats to be selected
    const seatsToSelect = [];
    for (let i = seatIndex; i < rowSeats.length && seatsToSelect.length < seatCount; i++) {
      if (rowSeats[i].isAvailable) {
        seatsToSelect.push(rowSeats[i].seatId);
      }
    }

    // If there are not enough seats in the current row, select seats from subsequent rows
    for (let i = 1; seatsToSelect.length < seatCount; i++) {
      const nextRowSeats = seatsByRow[String.fromCharCode(rowLetter.charCodeAt(0) + i)] || [];
      for (const seat of nextRowSeats) {
        if (seatsToSelect.length >= seatCount) break;
        if (seat.isAvailable) {
          seatsToSelect.push(seat.seatId);
        }
      }
    }

    // Set selected seats
    setSelectedSeats(prevSelectedSeats => {
      const newSelection = new Set(prevSelectedSeats);
      seatsToSelect.forEach(seat => newSelection.add(seat));
      return Array.from(newSelection).slice(0, seatCount);
    });
  }

  const handleBookNow = () => {
    const seatIDsString = selectedSeats.join(','); // Convert seat IDs array to a string
    router.push(`/user/buyTickets?seatIDs=${seatIDsString}&showID=${id}&total=${totalPrice}&movie=${movie}&theatre=${theatre}&showtime=${showtime}&showdate=${showdate}`);
  };

 return (
  <div className={styles.container}>
    {showModal ? (
      <div className={styles.modal}>
        <h2>Select Number of Seats</h2>
        <input
          type="number"
          value={seatCount}
          onChange={(e) => setSeatCount(Number(e.target.value))}
          min="1"
        />
        <button onClick={handleSaveSeats} className={styles.saveButton}>Save</button>
      </div>
    ) : (
      <>
        <h1>Select Your Seats</h1>
        <div className={styles.seatMap}>
          <div className={styles.details}>
            PRICE: <span className={styles.priceDetails}>Rs.{details}</span>
            <div>
              <span className={styles.ticketLabel}>NO: OF TICKETS:</span>
              <input
                type="number"
                value={seatCount}
                onChange={(e) => setSeatCount(Number(e.target.value))}
                min="1"
                className={styles.ticketInput}
              />
            </div>
          </div>
          {Object.keys(seatsByRow).map(row => (
            <div key={row} className={styles.row}>
              <div className={styles.rowLabel}>{row}</div>
              {seatsByRow[row].map((seat: any) => (
                <button
                  key={seat.seatId}
                  className={`${styles.seat} ${selectedSeats.includes(seat.seatId) ? styles.selected : ''} ${!seat.isAvailable ? styles.booked : ''}`}
                  onClick={() => seat.isAvailable && handleSeatClick(seat.seatId)}
                  disabled={!seat.isAvailable}
                >
                  {seat.seatId}
                </button>
              ))}
            </div>
          ))}
        </div>

        {selectedSeats.length === seatCount && (
          <button onClick={handleBookNow} className={styles.confirmButton}>
            Pay Rs.{totalPrice}
          </button>
        )}
      </>
    )}
  </div>
);

//    (
//   <><div className={styles.container}>
//     <h1>Select Your Seats</h1>
//     {showModal && (
//         <div className={styles.modal}>
//             <h2>Select Number of Seats</h2>
//             <input type="number" value={seatCount} onChange={(e: any) => setSeatCount(e.target.value)} min="1" />
//             <button onClick={handleSaveSeats} className={styles.saveButton}>Save</button>
//         </div>
//     )}
//     <div className={styles.seatMap}>
//         <div className={styles.details}>
//             PRICE: <span className={styles.priceDetails}>Rs.{details}</span>
//             <div>
//             <span className={styles.ticketLabel}>NO: OF TICKETS:</span>
//             <input
//                 type="number"
//                 value={seatCount}
//                 onChange={(e: any) => setSeatCount(e.target.value)}
//                 min="1"
//                 className={styles.ticketInput}
//             />
//             </div>
           
//         </div>
//         {Object.keys(seatsByRow).map(row => (
//             <div key={row} className={styles.row}>
//                 <div className={styles.rowLabel}>{row}</div>
//                 {seatsByRow[row].map((seat: any) => (
//                     <button
//                         key={seat.seatId}
//                         className={`${styles.seat} ${selectedSeats.includes(seat.seatId) ? styles.selected : ''} ${!seat.isAvailable ? styles.booked : ''}`}
//                         onClick={() => seat.isAvailable && handleSeatClick(seat.seatId)}
//                         disabled={!seat.isAvailable}
//                     >
//                         {seat.seatId}
//                     </button>
//                 ))}
//             </div>
//         ))}
//     </div>

   


//     {selectedSeats.length == seatCount && 
//       <button 
//       onClick={handleBookNow} 
//       className={styles.confirmButton}>
//         Pay Rs.{totalPrice} 
//     </button>
//     }
// </div>
// </>

//   );
  
};

export default Seatings;
