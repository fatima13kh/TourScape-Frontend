// src/components/Header/Header.jsx
import { useContext } from 'react';
import { Link } from 'react-router'; 
import { UserContext } from '../../contexts/UserContext';

const Header = () => {
  const { user } = useContext(UserContext);

  return (
    <header style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '400px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '4rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        TourScape
      </h1>
      <p style={{
        fontSize: '1.5rem',
        maxWidth: '600px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
      }}>
        Discover amazing tours and create unforgettable memories with trusted tour companies
      </p>
      {!user && (
        <div style={{ marginTop: '30px' }}>
          <Link to="/sign-up" style={{
            padding: '12px 30px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '1.1rem',
            marginRight: '15px'
          }}>
            Get Started
          </Link>
          <Link to="/sign-in" style={{
            padding: '12px 30px',
            backgroundColor: 'transparent',
            color: 'white',
            textDecoration: 'none',
            border: '2px solid white',
            borderRadius: '5px',
            fontSize: '1.1rem'
          }}>
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;