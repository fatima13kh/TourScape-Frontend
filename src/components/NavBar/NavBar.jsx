// src/components/NavBar/NavBar.jsx

// Import the useContext hook
import { useContext } from 'react';
import { Link } from 'react-router';

// Import the UserContext object
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  // Pass the UserContext object to the useContext hook to access:
  // - The user state (which we use here).
  // - The setUser function to update the user state (which we aren't using).
  //
  // Destructure the object returned by the useContext hook for easy access
  // to the data we added to the context with familiar names.
  const { user, setUser } = useContext(UserContext);

   const handleSignOut = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Clear the user state
    setUser(null);
  };

  return (
    <nav>
      <ul>
        {/* ALWAYS SHOW - Home, Tours & Companies for everyone */}
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/tours'>Tours</Link></li>
        <li><Link to='/companies'>Companies</Link></li>
        
        {/* Conditional: Profile (only when signed in) */}
        {user && <li><Link to='/profile'>Profile</Link></li>}
        
        {/* ALWAYS SHOW - Sign In/Sign Out */}
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

