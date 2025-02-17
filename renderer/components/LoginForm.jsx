import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/LoginForm.module.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState('');
  const usernameInputRef = useRef(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        setNotification('Login successful');
        setTimeout(() => {
          setNotification('');
          router.push('/home');
        }, 3000);
      } else {
        const errorData = await response.json();
        setNotification(`Error: ${errorData.error}`);
        setTimeout(() => setNotification(''), 3000);
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      setNotification('An error occurred');
      setTimeout(() => setNotification(''), 3000);
    } finally {
      usernameInputRef.current.focus();
    }
  };

  return (
    <div>
      {notification.message && (
        <p className={`${styles.alert} ${notification.type === 'success' ? styles['alert--success'] : styles['alert--error']}`}>
          {notification.message}
        </p>
      )}
      <form onSubmit={handleLogin} className={styles.form}>
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
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
