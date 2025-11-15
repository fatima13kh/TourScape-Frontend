// src/components/Dashboard/Dashboard.jsx

import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import * as userService from '../../services/userService'
import { UserContext } from '../../contexts/UserContext';


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
    </main>
  );
};


export default Dashboard;

