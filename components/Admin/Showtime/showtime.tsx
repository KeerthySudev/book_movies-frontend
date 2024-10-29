"use client";

import React, { useState, useEffect } from "react";
import styles from './showtime.module.css';
import { useRouter } from 'next/navigation';

const AddShowForm = () => {
  const router = useRouter();
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [movie, setMovie] = useState('');
  const [theatre, setTheatre] = useState('');
  const [showdate, setDate] = useState('');
  const [showtime, setTime] = useState('');
  const [price, setPrice] = useState();
  const [rows, setRows] = useState();
  const [seatPerRows, setSeatPerRows] = useState();
  

  // Fetch theatres from the backend using fetch
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/showTheatres")
      .then((response) => response.json())
      .then((data) => setTheatres(data))
      .catch((error) => console.error("Error fetching theatres:", error));

    fetch("http://localhost:5000/api/admin/showMovies")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));

      const fetchShows = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/admin/showTimes");
          
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
      
  }, []);

  const onDelete = async (id) => {
    if (confirm('Are you sure you want to delete this show?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/deleteShow?id=${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          // Remove the deleted movie from the state
          setShows(shows.filter(movie => movie._id !== id));
          alert('Show deleted successfully');
        } else {
          const errorData = await res.json();
          alert(`Failed to delete Show: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error deleting Show:', error);
        alert('An error occurred while deleting the Show');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      movie,
      theatre,
      showdate,
      showtime,
      price,
      rows,
      seatPerRows,
  };

    try {
      console.log(formData)
      const response = await fetch("http://localhost:5000/api/admin/shows", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      });

      const data = await response.json();
    console.log(data); 

      if (response.ok) {
        alert("Show added successfully");
        setMovie("");
        setTheatre("");
        setDate("");
        setTime("");
        setPrice();
        setRows();
        setSeatPerRows();
      } else {
        alert("Failed to add show");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the movie");
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let [hour, minute] = event.target.value.split(':');
    let ampm = 'AM';
    if (parseInt(hour) >= 12) {
      ampm = 'PM';
      if (parseInt(hour) > 12) {
        hour = (parseInt(hour) - 12).toString().padStart(2, '0');
      }
    } else if (parseInt(hour) === 0) {
      hour = '12';
    }
    const formattedTime = `${hour}:${minute} ${ampm}`;
    setTime(formattedTime);
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
  <nav className={styles.sidebar}>
        <h2>Admin Dashboard</h2>
        <ul>
          <li><a href="/admin/movie">Movies</a></li>
          <li><a href="/admin/theatre">Theatres</a></li>
          <li><a href="/admin/showtime">Showtimes</a></li>
          <li> <a onClick={handleLogout}>Logout</a></li>
        </ul>
      </nav>
  <div className={styles.tableContainer}>
      {shows ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Movie</th>
              <th>Theatre</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show: any) => (
              <tr key={show._id}>
                <td>{show.movie.title}</td>
                <td>{show.theatre.name}</td>
                <td>{show.showdate}</td>
                <td>{show.showtime}</td>
                <td>{show.price}</td>
                <td> <button 
                                    className={styles.button} 
                                    onClick={() => onDelete(show._id)}
                                >
                                    Delete
                                </button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No shows available.</p>
      )}
    </div>
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Select Movie:</label>
        <select
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          className={styles.select}
          required
        >
          <option value="" disabled>Select a movie</option>
          {movies.map((movie:any) => (
            <option key={movie._id} value={movie._id}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Select Theatre:</label>
        <select
          value={theatre}
          onChange={(e) => setTheatre(e.target.value)}
          className={styles.select}
          required
        >
          <option value="" disabled>Select a theatre</option>
          {theatres.map((theatre:any) => (
            <option key={theatre._id} value={theatre._id}>
              {theatre.name} - {theatre.location}
            </option>
          ))}
        </select>
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Date:</label>
        <input
          type="date"
          value={showdate}
          onChange={(e) => {
            const selectedDate = e.target.value;
            setDate(selectedDate); 
          }}
          className={styles.input}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Time:</label>
        <input
          type="time"
          value={showtime.replace(/ [AP]M$/, '')}
          onChange={handleTimeChange}
          className={styles.input}
          required
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={styles.input}
          min="1"
          required
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Rows:</label>
        <input
          type="number"
          value={rows}
          onChange={(e) => setRows(e.target.value)}
          className={styles.input}
          min="1"
          required
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Seats per row:</label>
        <input
          type="number"
          value={seatPerRows}
          onChange={(e) => setSeatPerRows(e.target.value)}
          className={styles.input}
          min="1"
          required
        />
      </div>
      
      <button type="submit" className={styles.button}>Add Show</button>
    </form>

    
        </>
  );
};

export default AddShowForm;
