import { useContext } from 'react';
import { Link } from 'react-router'; 
import { UserContext } from '../../contexts/UserContext';
import './Header.css';

const Header = () => {
  const { user } = useContext(UserContext);

  return (
    <header className="header">
      <h1 className="header-title">TourScape</h1>
      <p className="header-subtitle">
        Discover amazing tours and create unforgettable memories with trusted tour companies
      </p>
      {!user && (
        <div className="header-buttons">
          <Link to="/sign-up" className="get-started-button">
            Get Started
          </Link>
          <Link to="/sign-in" className="sign-in-button">
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;