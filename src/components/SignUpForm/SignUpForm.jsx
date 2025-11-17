import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import './SignUpForm.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState('tourCompany');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    passwordConf: '',
    description: '',
    role: 'tourCompany'
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    passwordConf: '',
    description: '',
  });

  const { username, email, phone, password, passwordConf, description } = formData;

  const checkErrors = ({ target }) => {
    if (target.name === 'username') {
      setErrors({
        ...errors,
        username:
          target.value.length < 3
            ? 'Username must be at least three characters long.'
            : '',
      });
    }
    if (target.name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors({
        ...errors,
        email:
          !emailRegex.test(target.value)
            ? 'Please enter a valid email address.'
            : '',
      });
    }
    if (target.name === 'phone') {
      const phoneRegex = /^\d{8}$/;
      setErrors({
        ...errors,
        phone:
          !phoneRegex.test(target.value) 
            ? 'Phone must be at least 8 digits (numbers only).'
            : '',
      });
    }
    if (target.name === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      setErrors({
        ...errors,
        password:
          !passwordRegex.test(target.value)
            ? 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.'
            : '',
        passwordConf:
          formData.passwordConf !== target.value
            ? 'The passwords do not match.'
            : '',
      });
    }
    if (target.name === 'passwordConf') {
      setErrors({
        ...errors,
        passwordConf:
          formData.password !== target.value
            ? 'The passwords do not match.'
            : '',
      });
    }
    if (target.name === 'description' && userType === 'tourCompany') {
      const wordCount = target.value.trim().split(/\s+/).length;
      setErrors({
        ...errors,
        description:
          wordCount < 3 && target.value.length > 0
            ? 'Description must be at least three words long.'
            : '',
      });
    }
  };

  const handleChange = (event) => {
    setMessage('');
    setFormData({ 
      ...formData, 
      [event.target.name]: event.target.value,
      role: userType
    });
    checkErrors(event);
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setFormData({
      ...formData,
      role: type,
      description: type === 'customer' ? '' : formData.description
    });
    
    if (type === 'customer') {
      setErrors({
        ...errors,
        description: ''
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const submitData = {
        username,
        email,
        phone,
        password,
        role: userType,
        ...(userType === 'tourCompany' && { description })
      };

      const newUser = await signUp(submitData);
      setUser(newUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const formIsInvalid = Object.values(errors).some(Boolean);
  const formHasMissingData = !(username && email && phone && password && passwordConf);

  return (
    <>      
    
    <Header />
    <main className="signup-container">
      <h1>Sign Up</h1>
      
      {/* Role Toggle Buttons */}
      <div className="role-toggle">
        <h3>I am a:</h3>
        <div className="role-buttons">
          <button 
            type="button"
            onClick={() => handleUserTypeChange('tourCompany')}
            className={`role-button ${userType === 'tourCompany' ? 'active' : ''}`}
          >
            Tour Company
          </button>
          <button 
            type="button"
            onClick={() => handleUserTypeChange('customer')}
            className={`role-button ${userType === 'customer' ? 'active' : ''}`}
          >
            Customer
          </button>
        </div>
      </div>

      <p style={{ color: 'red' }}>{message}</p>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="username">Username: </label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone: </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={handleChange}
            required
            placeholder="12345678 (numbers only)"
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            placeholder="At least 8 chars with Aa1@"
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="passwordConf">Password Confirmation:</label>
          <input
            type="password"
            id="passwordConf"
            name="passwordConf"
            value={passwordConf}
            onChange={handleChange}
            required
          />
          {errors.passwordConf && <p className="error-message">{errors.passwordConf}</p>}
        </div>

        {/* Description - Only for Tour Companies */}
        {userType === 'tourCompany' && (
          <div className="form-group">
            <label htmlFor="description">Company Description: </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              rows="3"
              placeholder="Tell us about your company (at least 3 words)..."
            />
            {errors.description && <p className="error-message">{errors.description}</p>}
          </div>
        )}

        <button type="submit" className="submit-button" disabled={formIsInvalid || formHasMissingData}>
          Sign Up
        </button>
        <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>
      </form>
      
      <p className="signin-link">
        Already have an account? <Link to='/sign-in'>Sign In</Link>
      </p>
    </main>
    <Footer />
    </>
  );
};

export default SignUpForm;