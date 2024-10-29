"use client";

import styles from './getMovie.module.css';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'; 
// const searchThriller = require('./movieData.js');

const GetMovie = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<any>(null);
  const BASE_URL = 'http://localhost:5000';
  const params = useParams();
  const { id } = params;
  
  const fetchMovies = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/getMovie?id=${encodeURIComponent(id)}`);
      
      console.log(`Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched movie data:', data);
        setMovies(data);
      } else {
        console.error('Response error:', await response.text());
      }
    } catch (error) {

      console.error('Fetch error:', error);
    } 
  };
  // Fetch theatres from the backend using fetch
  useEffect(() => {
    if (id) {
      console.log(id);
      fetchMovies();
    }
      }
      
  , []);

 

  const showMovie = (id: string) => {
    router.push(`/user/viewShows/${id}`);
  };

  return (
    <>
      {movies ? (
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <img 
              src={`${BASE_URL}${movies.posterUrl}`}
              alt={movies.title} 
              className={styles.poster}
            />
            <div className={styles.cardContent}>
              <h3>{movies.title}</h3>
              <p><strong>Genre:</strong> {movies.genre}</p>
              <p><strong>Language:</strong> {movies.language}</p>
              <p><strong>Director:</strong> {movies.director}</p>
              <p><strong>Cast:</strong> {movies.cast.join(', ')}</p>
              <p><strong>Synopsis:</strong> {movies.synopsis}</p>
              <div className={styles.buttonGroup}>
                <button onClick={() => showMovie(movies._id)}>Book tickets</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading movie details...</p> // Loading state
      )}
    </>
  );
  
};

export default GetMovie;
