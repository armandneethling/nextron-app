import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';

function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
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
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </nav>
  );
}

export default Header;
