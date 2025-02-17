import React from 'react';
import LoginForm from '../components/LoginForm';
import Header from '../components/Header';

const LoginPage = () => {
  return (
    <>
      <Header />
      <div>
        <h1>Login</h1>
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;