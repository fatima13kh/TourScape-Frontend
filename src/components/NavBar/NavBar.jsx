import { useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import './NavBar.css';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav className="navbar">
      <ul>
        <li><Link to='/'>Home</Link></li>
        {user && <li><Link to='/companies'>Companies</Link></li>}
        {user && <li><Link to='/profile'>Profile</Link></li>}
        {user ? (
          <li><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
        ) : (
          <li><Link to='/sign-in'>Sign In</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;