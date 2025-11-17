// src/components/Dashboard/Dashboard.jsx
import { useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import Tours from '../Tours/Tours';
import Header from '../Header/Header'; // Add this import
import Footer from '../Footer/Footer';

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Header /> {/* Add Header here */}
      
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ padding: '20px' }}>
          <h1>Welcome, {user.username}</h1>
          {/* Show Create Tour button only for tour companies */}
          {user?.role === 'tourCompany' && (
            <div style={{ marginTop: '20px', marginBottom: '30px' }}>
              <Link to="/tours/new">
                <button style={{
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1.1em',
                  cursor: 'pointer'
                }}>
                  CREATE TOUR
                </button>
              </Link>
            </div>
          )}

          {/* Use the existing Tours component */}
          <Tours />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Dashboard;