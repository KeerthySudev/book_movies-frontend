import React from 'react';
import styles from './sidebar.module.css'; // Import the CSS module for styling

const Sidebar = () => {
    return (
            <nav className={styles.sidebar}>
                <h2>Admin Dashboard</h2>
                <ul>
                    <li><a href="">Home</a></li>
                    <li><a href="/admin/movie">Movies</a></li>
                    <li><a href="/admin/theatre">Theatres</a></li>
                    <li><a href="/admin/showtime">Showtimes</a></li>
                </ul>
            </nav>
    );
};

export default Sidebar;
