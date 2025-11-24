import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import './SignInForm.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <>
      <Header />
    <main className="signin-container">
      <h1>Sign In</h1>
      <p>{message}</p>
      <form autoComplete='off' onSubmit={handleSubmit} className="signin-form">
        <div className="form-group">
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            autoComplete='off'
            id='username'
            value={formData.username}
            name='username'
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            autoComplete='off'
            id='password'
            value={formData.password}
            name='password'
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-group">
          <button className="submit-button">Sign In</button>
          <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>

      <p className="signup-link">
        Don't have an account? <Link to='/sign-up'>Sign Up</Link>
      </p>
    </main>
    <Footer />
    </>
  );
};

export default SignInForm;