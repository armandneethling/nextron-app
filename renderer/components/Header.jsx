import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('userId');
    if (loggedInUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        router.push('/login');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className={styles.nav}>
      <Link href="/home">Home</Link>
      <Link href="/upload">Upload a Video</Link>
      <Link href="/register">Register</Link>
      <Link href="/login">Login</Link>
      {isLoggedIn && (
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Header;
