import React from 'react';
import Link from 'next/link';
import '../styles/global.css';

function Header() {
  return (
    <nav>
      <Link href="/home">Home</Link>
      <Link href="/next">About</Link>
    </nav>
  );
}

export default Header;
