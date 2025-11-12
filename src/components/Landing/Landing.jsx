// src/components/Landing.jsx

import { Link } from 'react-router';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const Landing = () => {
  const { user } = useContext(UserContext);

  return (
    <main>
      <h1>Hello, you are on the landing page for visitors.</h1>
      <p>Sign up now, or sign in to see your super secret dashboard!</p>

      {/* Show Create Tour button only for tour companies */}
      {user?.role === 'tourCompany' && (
        <div style={{ marginTop: '20px' }}>
          <Link to="/tours/new">
            <button>CREATE TOUR</button>
          </Link>
        </div>
      )}
      
    </main>
  );

};

export default Landing;

