import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

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
    
    // Clear description error when switching to customer
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
    <main>
      <h1>Sign Up</h1>
      
      {/* Role Toggle Buttons */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h3>I am a:</h3>
        <div>
          <button 
            type="button"
            onClick={() => handleUserTypeChange('tourCompany')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: userType === 'tourCompany' ? '#007bff' : '#f8f9fa',
              color: userType === 'tourCompany' ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Tour Company
          </button>
          <button 
            type="button"
            onClick={() => handleUserTypeChange('customer')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: userType === 'customer' ? '#007bff' : '#f8f9fa',
              color: userType === 'customer' ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Customer
          </button>
        </div>
      </div>

      <p style={{ color: 'red' }}>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className="error" style={{ color: 'red', fontSize: '0.8em', margin: '5px 0' }}>{errors.username}</p>}
        </div>
        
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error" style={{ color: 'red', fontSize: '0.8em', margin: '5px 0' }}>{errors.email}</p>}
        </div>
        
        <div>
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
          {errors.phone && <p className="error" style={{ color: 'red', fontSize: '0.8em', margin: '5px 0' }}>{errors.phone}</p>}
        </div>
        
        <div>
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
          {errors.password && <p className="error" style={{ color: 'red', fontSize: '0.8em', margin: '5px 0' }}>{errors.password}</p>}
        </div>
        
        <div>
          <label htmlFor="passwordConf">Password Confirmation:</label>
          <input
            type="password"
            id="passwordConf"
            name="passwordConf"
            value={passwordConf}
            onChange={handleChange}
            required
          />
          {errors.passwordConf && <p className="error" style={{ color: 'red', fontSize: '0.8em', margin: '5px 0' }}>{errors.passwordConf}</p>}
        </div>

        {/* Description - Only for Tour Companies */}
        {userType === 'tourCompany' && (
          <div>
            <label htmlFor="description">Company Description: </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              rows="3"
              placeholder="Tell us about your company (at least 3 words)..."
            />
            {errors.description && <p className="error" style={{ color: 'red', fontSize: '0.8em', margin: '5px 0' }}>{errors.description}</p>}
          </div>
        )}

        <button type="submit" disabled={formIsInvalid || formHasMissingData}>
          Sign Up
        </button>
        <button type="button" onClick={() => navigate('/')}>Cancel</button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to='/sign-in'>Sign In</Link>
      </p>
    </main>
  );
};

export default SignUpForm;