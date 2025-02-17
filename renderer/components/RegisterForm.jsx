import { useState, useRef } from 'react';
import styles from '../styles/RegisterForm.module.css';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState('');
  const usernameInputRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: username, username, password, role: 'user' }),
      });

      if (response.ok) {
        setNotification('Registration successful');
        setTimeout(() => {
          setNotification('');
          usernameInputRef.current.focus();
        }, 3000);
      } else {
        const errorData = await response.json();
        setNotification(`Error: ${errorData.error}`);
        setTimeout(() => setNotification(''), 3000);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setNotification('An error occurred');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div>
      {notification && <div className={styles.alert}>{notification}</div>}
      <form onSubmit={handleRegister} className={styles.form}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className={styles.input}
          ref={usernameInputRef}
        />
        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className={styles.input}
          />
          <button
            type="button"
            className={styles.viewPasswordButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit" className={styles.button}>Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
