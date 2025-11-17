import { useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import Tours from '../Tours/Tours';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Header />
      
      <main className="dashboard-container">
        <div className="dashboard-content">
          <h1>Welcome, {user.username}</h1>
          {/* Show Create Tour button only for tour companies */}
          {user?.role === 'tourCompany' && (
            <div>
              <Link to="/tours/new">
                <button className="create-tour-button">
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