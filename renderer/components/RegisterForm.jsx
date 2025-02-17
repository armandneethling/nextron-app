import { useState, useRef } from 'react';
import styles from '../styles/RegisterForm.module.css';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
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
        setNotification({ message: 'Registration successful', type: 'success' });
        setTimeout(() => {
          setNotification({ message: '', type: '' });
          usernameInputRef.current.focus();
        }, 3000);
      } else {
        const errorData = await response.json();
        setNotification({ message: `Error: ${errorData.error}`, type: 'error' });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setNotification({ message: 'An error occurred', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  return (
    <div>
      {notification.message && (
        <p className={`${styles.alert} ${notification.type === 'success' ? styles['alert--success'] : styles['alert--error']}`}>
          {notification.message}
        </p>
      )}
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
