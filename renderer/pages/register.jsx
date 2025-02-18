import React from 'react';
import RegisterForm from '../components/RegisterForm';
import Header from '../components/Header';
import styles from '../styles/login-register-page.module.css';

const RegisterPage = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Register</h1>
        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;
