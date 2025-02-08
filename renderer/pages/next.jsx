import React from 'react'
import Header from '../components/Header'
import '../styles/global.css';


export default function NextPage() {
  return (
    <React.Fragment>
      <Header />
      <div>
        <p>
          ⚡ Electron + Next.js ⚡
        </p>
      </div>
    </React.Fragment>
  )
}
