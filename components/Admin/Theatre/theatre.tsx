'use client'
import styles from './theatre.module.css';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TheatreForm = () => {
  const router = useRouter();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [seatingCapacity, setSeatingCapacity] = useState();
    const [theatres, setTheatres] = useState([]);

      // Fetch theatres from the backend using fetch
  useEffect(() => {

      const fetchTheatres = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/admin/showTheatres");
          
          console.log(`Response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Fetched user data:', data);
            setTheatres(data);
          } else {
            console.error('Response error:', await response.text());
          }
        } catch (error) {
    
          console.error('Fetch error:', error);
        } 
      };
      fetchTheatres();
      
  }, []); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const theatreData = {
            name,
            location,
            seatingCapacity,
        };

        try {
            const response = await fetch('http://localhost:5000/api/admin/theatres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(theatreData),
            });

            if (response.ok) {
                alert('Theatre created successfully');
                setName('');
                setLocation('');
                // setSeatingCapacity();
            } else {
                alert('Failed to create theatre');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating the theatre');
        }
    };

    const onDelete = async (theatreId) => {
      if (confirm('Are you sure you want to delete this theatre?')) {
        try {
          const res = await fetch(`http://localhost:5000/api/admin/deleteTheatre?id=${theatreId}`, {
            method: 'DELETE',
          });
  
          if (res.ok) {
            // Remove the deleted movie from the state
            setTheatres(theatres.filter(movie => movie._id !== theatreId));
            alert('Theatre deleted successfully');
          } else {
            const errorData = await res.json();
            alert(`Failed to delete Theatre: ${errorData.error}`);
          }
        } catch (error) {
          console.error('Error deleting Theatre:', error);
          alert('An error occurred while deleting the Theatre');
        }
      }
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
        {theatres ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Seating Capacity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {theatres.map((theatre:any) => (
                <tr key={theatre._id}>
                  <td>{theatre.name}</td>
                  <td>{theatre.location}</td>
                  <td>{theatre.seatingCapacity}</td>
                  <td>
                    <button 
                      className={styles.button} 
                      onClick={() => onDelete(theatre._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No theatres available.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div>
          <label htmlFor="name">Theatre Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="seatingCapacity">Seating Capacity:</label>
          <input
            type="number"
            id="seatingCapacity"
            value={seatingCapacity}
            onChange={(e) => setSeatingCapacity(e.target.value)}
            min="1"
            required
          />
        </div>

        <button type="submit">Create Theatre</button>
      </form>
    </>
    );
};

export default TheatreForm;
