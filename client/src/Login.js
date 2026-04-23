import { useState } from 'react';
import API from './api';

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', form);

      localStorage.setItem('token', res.data.token);

      alert('Login successful!');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;