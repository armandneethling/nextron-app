import React from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';

function Header() {
  return (
    <nav className={styles.nav}>
      <Link href="/home">Home</Link>
      <Link href="/upload">Upload a Video</Link>
    </nav>
  );
}

export default Header;
