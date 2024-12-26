import React, { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { LoginRequest, JwtResponse, AuthResponse } from '../types/auth';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    console.log('API URL:', `${process.env.REACT_APP_API_URL}/api/v1/auth/login`);
    console.log('Login Request Payload:', credentials);

    try {
      console.log('Sending login request...');
      const response = await axios.post<AuthResponse>(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/login`,
        credentials
      );
      console.log('Login response:', response.data);
      if (response.data.success) {
        // Store the token from the nested data object
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        setMessage(response.data.message || 'Login successful!');
      } else {
        setMessage(response.data.message || 'Login failed');
      }
      
    } catch (error) {
      const axiosError = error as AxiosError<AuthResponse>;
      setMessage(axiosError.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p className={message.includes('successful') ? 'success' : 'error'}>{message}</p>}
    </div>
  );
};

export default Login;