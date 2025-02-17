import React from 'react';
import RegisterForm from '../components/RegisterForm';
import Header from '../components/Header';

const RegisterPage = () => {
  return (
    <>
      <Header />
      <div>
        <h1>Register</h1>
        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;