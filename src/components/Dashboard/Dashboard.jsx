import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as userService from "../../services/userService";
import * as tourService from "../../services/tourService";
import { UserContext } from "../../contexts/UserContext";
import ToursList from "../ToursList/ToursList";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users (optional)
  useEffect(() => {
    if (!user) return;
    userService.index().then(console.log).catch(console.error);
  }, [user]);

  // Fetch tours
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await tourService.getAllTours();
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
      <p>This is the dashboard page where you can see a list of tours.</p>

      {user?.role === "tourCompany" && (
        <div style={{ marginTop: "20px" }}>
          <Link to="/tours/new">
            <button>CREATE TOUR</button>
          </Link>
        </div>
      )}

      {/* SHOW TOURS */}
      <div style={{ marginTop: "2rem" }}>
        <ToursList
          tours={tours}
          loading={loading}
          isCompanyView={user?.role === "tourCompany"}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
    </main>
  );
};

export default Dashboard;
