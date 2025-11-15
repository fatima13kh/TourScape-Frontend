// src/components/Dashboard/Dashboard.jsx

import { useContext, useEffect } from 'react';
import { Link } from 'react-router';
import * as userService from '../../services/userService'
import { UserContext } from '../../contexts/UserContext';
import ToursList from "../ToursList/ToursList.jsx";


const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [tours, setTours] = useState([]);

   useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.index();
        console.log(fetchedUsers);
      } catch (err) {
        console.log(err)
      }
    }
    if (user) fetchUsers();
  }, [user]);

  // Fetch tours
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await tourService.getAllTours();  //  CALL YOUR SERVICE
        setTours(data);
      } catch (err) {
        console.log("Error fetching tours:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);



  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>This is the dashboard page where you can see a list of all the tours.</p>

      {/* Show Create Tour button only for tour companies */}
      {user?.role === 'tourCompany' && (
        <div style={{ marginTop: '20px' }}>
          <Link to="/tours/new">
            <button>CREATE TOUR</button>
          </Link>
        </div>
      )}

      {/* ⭐ SHOW THE TOURS LIST */}
      <div style={{ marginTop: '2rem' }}>
        <ToursList
          tours={tours}
          loading={loading}
          isCompanyView={user?.role === 'tourCompany'}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
    </main>
  );
};


export default Dashboard;

