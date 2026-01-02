import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { validateEmail, validatePassword } from '../utils/auth';
import './styles/Auth.css';
import MoneyVueLogo from '../assets/Finance_Logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    jobRole: '',
    monthlySalary: '',
    currency: 'USD',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, age, jobRole, monthlySalary, currency, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateEmail(email)) { setError('Please enter a valid email address'); setLoading(false); return; }
    if (!validatePassword(password)) { setError('Password must be at least 6 characters long'); setLoading(false); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }

    const payload = { ...formData, age: Number(age), monthlySalary: Number(monthlySalary), currency: currency || 'USD' };

    try {
      await axios.post('http://localhost:5000/api/auth/register', payload);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.msg || err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={MoneyVueLogo} alt="MoneyVue Logo" className="logo-image" />
        </div>
        <h2 className="auth-title">Create Account</h2>
        <form onSubmit={onSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Full Name"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email Address"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="age"
              value={age}
              onChange={onChange}
              placeholder="Age"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="jobRole"
              value={jobRole}
              onChange={onChange}
              placeholder="Job Role"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="monthlySalary"
              value={monthlySalary}
              onChange={onChange}
              placeholder="Monthly Salary"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <select
              name="currency"
              value={currency}
              onChange={onChange}
              required
              className="form-input"
            >
              <option value="">Select Currency</option>
              <option value="USD">🇺🇸 USD - US Dollar</option>
              <option value="EUR">🇪🇺 EUR - Euro</option>
              <option value="GBP">🇬🇧 GBP - British Pound</option>
              <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
              <option value="CNY">🇨🇳 CNY - Chinese Yuan</option>
              <option value="INR">🇮🇳 INR - Indian Rupee</option>
              <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
              <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
              <option value="CHF">🇨🇭 CHF - Swiss Franc</option>
              <option value="MXN">🇲🇽 MXN - Mexican Peso</option>
              <option value="BRL">🇧🇷 BRL - Brazilian Real</option>
              <option value="ZAR">🇿🇦 ZAR - South African Rand</option>
              <option value="SGD">🇸🇬 SGD - Singapore Dollar</option>
              <option value="HKD">🇭🇰 HKD - Hong Kong Dollar</option>
              <option value="KRW">🇰🇷 KRW - South Korean Won</option>
              <option value="SEK">🇸🇪 SEK - Swedish Krona</option>
              <option value="NOK">🇳🇴 NOK - Norwegian Krone</option>
              <option value="DKK">🇩🇰 DKK - Danish Krone</option>
              <option value="PLN">🇵🇱 PLN - Polish Zloty</option>
              <option value="THB">🇹🇭 THB - Thai Baht</option>
              <option value="MYR">🇲🇾 MYR - Malaysian Ringgit</option>
              <option value="IDR">🇮🇩 IDR - Indonesian Rupiah</option>
              <option value="PHP">🇵🇭 PHP - Philippine Peso</option>
              <option value="TRY">🇹🇷 TRY - Turkish Lira</option>
              <option value="RUB">🇷🇺 RUB - Russian Ruble</option>
              <option value="AED">🇦🇪 AED - UAE Dirham</option>
              <option value="SAR">🇸🇦 SAR - Saudi Riyal</option>
              <option value="EGP">🇪🇬 EGP - Egyptian Pound</option>
              <option value="NGN">🇳🇬 NGN - Nigerian Naira</option>
              <option value="KES">🇰🇪 KES - Kenyan Shilling</option>
              <option value="LKR">🇱🇰 LKR - Sri Lankan Rupee</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="Confirm Password"
              required
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
