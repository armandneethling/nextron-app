import React from 'react'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import UploadForm from '../components/UploadForm'

export default function UploadPage() {
  const router = useRouter()

  const handleUpload = (filename) => {
    router.push(`/home?video=${filename}`)
  }

  return (
    <React.Fragment>
      <Header />
      <div>
        <h1>Upload a video</h1>
        <UploadForm onUpload={handleUpload}/>
      </div>
    </React.Fragment>
  )
}
