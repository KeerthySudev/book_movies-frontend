"use client";

import styles from './movie.module.css';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const AddMovieForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [director, setDirector] = useState("");
  const [cast, setCast] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [movies, setMovies] = useState<any>(null);

  const BASE_URL = 'http://localhost:5000';
  

  // Fetch theatres from the backend using fetch
  useEffect(() => {

      const fetchMovies = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/admin/showMovies");
          
          console.log(`Response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Fetched user data:', data);
            setMovies(data);
          } else {
            console.error('Response error:', await response.text());
          }
        } catch (error) {
    
          console.error('Fetch error:', error);
        } 
      };
fetchMovies();
      
  }, []);


  const handleFileChange = (e) => {
    setPosterFile(e.target.files[0]);
  };

  const onDelete = async (movieId) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/deleteMovie?movieId=${movieId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          // Remove the deleted movie from the state
          setMovies(movies.filter(movie => movie._id !== movieId));
          alert('Movie deleted successfully');
        } else {
          const errorData = await res.json();
          alert(`Failed to delete movie: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error deleting movie:', error);
        alert('An error occurred while deleting the movie');
      }
    }
  };

  const handleCastChange = (e) => {
    setCast(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("language", language);
    formData.append("director", director);
    formData.append("cast", cast);
    formData.append("synopsis", synopsis);
    if (posterFile) {
      formData.append("poster", posterFile); 
    } 

    try {
      const response = await fetch("http://localhost:5000/api/admin/movies", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Movie added successfully");
        setTitle("");
        setGenre("");
        setLanguage("");
        setDirector("");
        setCast([]);
        setSynopsis("");
        setPosterFile(null);
      } else {
        alert("Failed to add movie");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the movie");
    }
  };

  const test = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/user/test`, {
        method: "GET",
      });
      
      console.log(`Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched genre data:', data.responseData);
        const details = data.responseData;
        setTitle(details.Title);
        setSynopsis(details.Plot);
        setDirector(details.Director);
        setCast(details.Actors);
        handleCastChange(cast);
        
      } else {
        console.error('Response error:', await response.text());
      }
    } catch (error) {

      console.error('Fetch error:', error);
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
        router.push('http://localhost:3000'); 
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
  
    <>
  {/* <button onClick={test}>getMovie</button> */}
  <div className={styles.dashboard}>
      <nav className={styles.sidebar}>
        <h2>Admin Dashboard</h2>
        <ul>
          <li><a href="/admin/movie">Movies</a></li>
          <li><a href="/admin/theatre">Theatres</a></li>
          <li><a href="/admin/showtime">Showtimes</a></li>
          <li> <a onClick={handleLogout}>Logout</a></li>
        </ul>
      </nav>

      <div className={styles.content}>
      

      <div className={styles.cardContainer}>
            {movies ? (
                movies.map((movie) => (
                    <div key={movie._id} className={styles.card}>
                        <img 
                            src={`${BASE_URL}${movie.posterUrl}`}
                            alt={movie.title} 
                            className={styles.poster}
                        />
                        <div className={styles.cardContent}>
                            <h3>{movie.title}</h3>
                            <p><strong>Genre:</strong> {movie.genre}</p>
                            <p><strong>Language:</strong> {movie.language}</p>
                            <p><strong>Director:</strong> {movie.director}</p>
                            <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
                            <p><strong>Synopsis:</strong> {movie.synopsis}</p>
                            <div className={styles.buttonGroup}>
                                {/* <button 
                                    className={styles.button} 
                                    onClick={() => onEdit(movie._id)}
                                >
                                    Edit
                                </button> */}
                                <button 
                                    className={styles.button} 
                                    onClick={() => onDelete(movie._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No movies available.</p>
            )}
        </div>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div>
              <label>Title:</label>
              <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required />
          </div>
          <div>
              <label>Genre:</label>
              <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required />
          </div>
          <div>
              <label>Language:</label>
              <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required />
          </div>
          <div>
              <label>Director:</label>
              <input
                  type="text"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)} 
                  required/>
          </div>
          <div>
              <label>Cast (comma-separated):</label>
              <input type="text" value={cast} onChange={handleCastChange} 
              required/>
          </div>
          <div>
              <label>Synopsis:</label>
              <textarea
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)} 
                  required/>
          </div>
          <div>
              <label>Poster URL:</label>
              <input type="file" onChange={handleFileChange} required />
          </div>

          <button type="submit">Add Movie</button>
      </form>
      </div>
    </div>
</>

  );
};

export default AddMovieForm;
