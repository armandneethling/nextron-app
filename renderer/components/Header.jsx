import React from 'react';
import Link from 'next/link';

function Header() {
  return (
    <nav>
      <Link href="/home">Home</Link>
      <Link href="/upload">Upload a Video</Link>
    </nav>
  );
}

export default Header;
