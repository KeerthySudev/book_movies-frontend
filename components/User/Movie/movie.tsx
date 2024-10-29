"use client";

import styles from "./movies.module.css";
import React, { useState, useEffect, ReactHTMLElement } from "react";
import { useRouter } from "next/navigation";

const ShowMovies = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<any>(null);
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [authenticated, setAuthenticated] = useState('');
  const [showtimes, setShowtimes] = useState<string[]>([]);
  const [selectedShowtimes, setSelectedShowtimes] = useState<string[]>([]);
  const [word, setWord] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const BASE_URL = "http://localhost:5000";

  // Fetch theatres from the backend using fetch
  useEffect(() => {
    console.log("searchPerformed has changed:", searchPerformed);
    if (searchPerformed == false) {
      const fetchMovies = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/admin/showMovies"
          );

          console.log(`Response status: ${response.status}`);

          if (response.ok) {
            const data = await response.json();
            setMovies(data);

            const allLanguages = data.map((movie: any) => movie.language);
            const distinctLanguages = Array.from(
              new Set(allLanguages)
            ) as string[]; 
            setLanguages(distinctLanguages);

            const allGenres = data.map((movie: any) => movie.genre);
            const distinctGenres = Array.from(new Set(allGenres)) as string[]; 
            setGenres(distinctGenres);

            const allShowtimes = data.map((movie: any) => movie.showtime);
            const distinctShowtimes = Array.from(
              new Set(allShowtimes)
            ) as string[]; 
            setShowtimes(distinctShowtimes);

          } else {
            console.error("Response error:", await response.text());
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };
      fetchMovies();
    }
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/session', {
          credentials: 'include', // Ensure cookies/session are sent with the request
        });

        if (response.ok) {
          const data = await response.json();
          setAuthenticated(data.authenticated);
          console.log( 'data',data);
          console.log( 'auth',data.authenticated);
          console.log('user',data.authenticated._id);
        } else {
          console.error('Failed to fetch session data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };
    checkSession();
  }, [searchPerformed]);

  const handleClick = () => {
    window.location.href = "http://localhost:5000/api/home/google"; // Redirect to Express server for Google sign-in
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

  const searchMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/searchMovie?word=${encodeURIComponent(
          word
        )}`,
        {
          method: "GET",
        }
      );

      console.log(`Response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        setMovies(data);
        setSearchPerformed(true);
      } else {
        console.error("Response error:", await response.text());
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const showMovie = (id: string) => {
    router.push(`/user/getMovie/${id}`);
  };

  const searchMatinee = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/searchMatinee`,
        {
          method: "GET",
        }
      );

      console.log(`Response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        setMovies(data);
        setSearchPerformed(true);
      } else {
        console.error("Response error:", await response.text());
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Toggle the selected language in the array
  const toggleLanguageSelection = (language: string) => {
    setSelectedLanguages((prevSelected) => {
      if (prevSelected.includes(language)) {
        // If the language is already selected, remove it
        return prevSelected.filter((lang) => lang !== language);
      } else {
        // If it's not selected, add it
        return [...prevSelected, language];
      }
    });
    if (!searchPerformed) {
      setSearchPerformed(true);
    }
  };
  const toggleGenreSelection = (genre: string) => {
    setSelectedGenres((prevSelected) => {
      if (prevSelected.includes(genre)) {
        return prevSelected.filter((x) => x !== genre);
      } else {
        // If it's not selected, add it
        return [...prevSelected, genre];
      }
    });
    if (!searchPerformed) {
      setSearchPerformed(true);
    }
  };

  const toggleShowtimeSelection = (showtime: string) => {
    setSelectedShowtimes((prevSelected) => {
      if (prevSelected.includes(showtime)) {
        return prevSelected.filter((x) => x !== showtime);
      } else {
        // If it's not selected, add it
        return [...prevSelected, showtime];
      }
    });
    if (!searchPerformed) {
      setSearchPerformed(true);
    }
  };

  const filterMovies = () => {
    if (selectedLanguages.length === 0 && selectedGenres.length === 0 && selectedShowtimes.length === 0) {
      return movies;
    }
    return movies.filter(
      (movie) =>
        (selectedLanguages.length === 0 ||
          selectedLanguages.includes(movie.language)) &&
        (selectedGenres.length === 0 || selectedGenres.includes(movie.genre)) &&
        (selectedShowtimes.length === 0 || selectedShowtimes.includes(movie.showtime))
    );
  };

  const filteredMovies = filterMovies();

 
  const resetFilters = () => {
    setSearchPerformed(true);
    setSelectedLanguages([]);
    setSelectedGenres([]);
    setSelectedShowtimes([]);
  };

  return (
    
      <div className={styles.container}>
        <div className={styles.navbar}>
          <div className={styles.logo}>
            <img src="/images/logo3.png" alt="logo"></img>
            <h4>Book Movies</h4>
          </div>
          <div className={styles.searchbar}>
            <form onSubmit={searchMovie} className={styles.formContainer}>
              <div>
                <input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="Search.."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchMovie(e);
                    }
                  }}
                  required
                />
              </div>
            </form>
          </div>
          {!authenticated ? (
            <div className={styles.signin}>
              <button onClick={handleClick}>Sign In</button>
            </div>
          ) : <><div className={styles.booking}>
          <button><a href="/user/bookings">Booking history</a></button>
        </div><br />
        <div className={styles.signin}>
          <button onClick={handleLogout}>Log out</button>
        </div></>}
        </div>
        <div className={styles.content}>
          <div className={styles.filters}>
            {/* <h2>FILTERS</h2> */}
            <div className={styles.filterGroup}>
              <h4>GENRES</h4>
              <div className={styles.searchButtons}>
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenreSelection(genre)}
                    className={`${styles.searchButton} ${
                      selectedGenres.includes(genre) ? styles.selected : ""
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              {/* <h4>Showtimes</h4>
              <div className={styles.searchButtons}>
                {showtimes.map((showtime) => (
                  <button
                    key={showtime}
                    onClick={() => toggleShowtimeSelection(showtime)}
                    className={`${styles.searchButton} ${
                      selectedShowtimes.includes(showtime) ? styles.selected : ""
                    }`}
                  >
                    {showtime}
                  </button>
                ))}
              </div> */}
              <button className={styles.resetButton} onClick={resetFilters}>
                Reset filters
              </button>
            </div>
          </div>
          <div className={styles.movies}>
            <h2>MOVIES</h2>
            <div className={styles.searchButtons}>
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() => toggleLanguageSelection(language)}
                  className={`${styles.searchButton} ${
                    selectedLanguages.includes(language) ? styles.selected : ""
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>

            <div className={styles.cardContainer}>
              {filteredMovies ? (
                filteredMovies.map((movie) => (
                  <div
                    key={movie._id}
                    className={styles.card}
                    onClick={() => showMovie(movie._id)}
                  >
                    <img
                      src={`${BASE_URL}${movie.posterUrl}`}
                      alt={movie.title}
                      className={styles.poster}
                    />

                    <div className={styles.cardContent}>
                      <h3>{movie.title}</h3>
                      <p>{movie.genre}</p>
                      <p> {movie.language}</p>
                      <div className={styles.buttonGroup}></div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No movies available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default ShowMovies;
