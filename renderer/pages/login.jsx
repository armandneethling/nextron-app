import React from 'react';
import LoginForm from '../components/LoginForm';
import Header from '../components/Header';
import styles from '../styles/login-register-page.module.css';

const LoginPage = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Login</h1>
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;
