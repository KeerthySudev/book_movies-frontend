import React from 'react';
import styles from './adminHome.module.css'; // Import the CSS module for styling

const Dashboard = () => {
    return (
        <div className={styles.dashboard}>
            <nav className={styles.sidebar}>
                <h2>Admin Dashboard</h2>
                <ul>
                    <li><a href="">Home</a></li>
                    <li><a href="/admin/movie">Movies</a></li>
                    <li><a href="/admin/theatre">Theatres</a></li>
                    <li><a href="/admin/showtime">Showtimes</a></li>
                </ul>
            </nav>
            <main className={styles.content}>
                <h1>Welcome to the Admin Dashboard</h1>
                {/* <p>Select an option from the sidebar to manage the content.</p> */}
            </main>
        </div>
    );
};

export default Dashboard;
