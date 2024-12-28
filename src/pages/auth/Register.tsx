import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AddressDTO, PhoneNumberDTO } from '../../types/common';
import { CreateUserRequest } from '../../types/user';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (formData.get('password') !== formData.get('confirmPassword')) {
      setError('Passwords do not match');
      return;
    }

    const registerRequest: CreateUserRequest = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: '',
      lastName: '',
      address: {
        street: '',
        city: '',
        zipCode: '',
        country: '',
      } as AddressDTO,
      phoneNumber: {
        value: '',
      } as PhoneNumberDTO,
      dateOfBirth: new Date().toISOString(),
      authorities: ['ROLE_USER'],
    };

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerRequest),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/path-to-your-logo.png" alt="Logo" className="mx-auto h-12 w-auto" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-medium text-center mb-6">Zarejestruj się</h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8">Create your account to get started</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-center text-sm">{error}</div>}

          <div>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            KONTYNUUJ
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
