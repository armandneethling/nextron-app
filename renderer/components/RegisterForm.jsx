import { useState, useRef, useEffect } from 'react';
import styles from '../styles/RegisterForm.module.css';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const usernameInputRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Debugging line

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: username, username, password, role: 'user' }),
      });

      if (response.ok) {
        alert('Registration successful');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      console.log('Form submission complete'); // Debugging line
      usernameInputRef.current.focus();
    }
  };

  useEffect(() => {
    console.log('Checking for JavaScript errors'); // Debugging line
    // Check for global event listeners
    window.addEventListener('click', (event) => {
      console.log('Window click event', event);
    });
    document.addEventListener('click', (event) => {
      console.log('Document click event', event);
    });

    // Inspect CSS styles for input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      console.log(input, window.getComputedStyle(input));
    });

    // Check for overlapping elements
    const form = document.querySelector(`.${styles.form}`);
    const boundingBox = form.getBoundingClientRect();
    console.log('Form bounding box:', boundingBox);

    const overlappedElements = document.elementsFromPoint(boundingBox.left, boundingBox.top);
    console.log('Overlapping elements:', overlappedElements);
  }, []);

  return (
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
  );
};

export default RegisterForm;
