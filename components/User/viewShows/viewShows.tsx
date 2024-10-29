
"use client";

import styles from './viewShows.module.css';
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation'; 
import { useRouter } from 'next/navigation';

const ViewShows = () => {
  const [shows, setShows] = useState([]);
  const router = useRouter();
  const params = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const { id } = params;


  // Fetch theatres from the backend using fetch
  useEffect(() => {

      const fetchShows = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/user/getShows?id=${encodeURIComponent(id)}&date=${encodeURIComponent(selectedDate)}`);
          
          console.log(`Response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Fetched user data:', data);
            setShows(data);
          } else {
            console.error('Response error:', await response.text());
          }
        } catch (error) {
    
          console.error('Fetch error:', error);
        } 
      };
      fetchShows();
      
  }, [selectedDate]);
  const handleButtonClick = (id: string) => {
    router.push(`/user/seatings/${id}`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);  // Update the selected date
  };


  return (
    
      
      <div>
      <div className={styles.datePickerContainer}>
        {/* Date Picker */}
        <label htmlFor="show-date" className={styles.dateLabel}>Select a date:</label>
        <input 
          type="date" 
          id="show-date" 
          className={styles.datePicker}
          value={selectedDate} 
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]}
        />
        </div>
            
            {shows.length > 0 ? (
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Theatre</th>
              <th className={styles.th}>Time</th>
              <th className={styles.th}>Price</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show : any) => (
              <tr key={show._id} className={styles.tbodyRow}>
                <td className={styles.tbodyCell}>{show.theatre.name}</td>
                <td className={styles.tbodyCell}>
                  <button className={styles.button} onClick={() => handleButtonClick(show._id)}>
                    {show.showtime}
                  </button>
                </td>
                <td className={styles.tbodyCell}>{show.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.text}>
<p>No shows available. Select another date</p>
        </div>
        
      )}
        </div>
        
  );
};

export default ViewShows;
