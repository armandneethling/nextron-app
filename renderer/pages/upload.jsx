import React from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import UploadForm from '../components/UploadForm';
import styles from '../styles/UploadPage.module.css';

export default function UploadPage() {
  const router = useRouter();

  const handleUpload = (filename) => {
    router.push(`/home?video=${filename}`);
  };

  return (
    <React.Fragment>
      <Header />
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Upload a video</h1>
        <UploadForm onUpload={handleUpload} />
      </div>
    </React.Fragment>
  );
}
