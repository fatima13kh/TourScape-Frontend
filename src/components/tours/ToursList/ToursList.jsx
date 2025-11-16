// src/components/tours/ToursList/ToursList.jsx

import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import * as toursService from '../../../services/toursService';
import FavoriteButton from '../../favorites/FavoriteButton/FavoriteButton';

const ToursList = () => {
  const { user } = useContext(UserContext);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const fetchedTours = await toursService.index();
        setTours(fetchedTours);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [user]);

  if (!user) {
    return (
      <main>
        <h1>Tours</h1>
        <p>Please sign in to view tours.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main>
        <h1>Tours</h1>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>All Tours</h1>
      {message && <p>{message}</p>}

      {tours.length === 0 ? (
        <p>No tours available yet.</p>
      ) : (
        <ul>
          {tours.map((tour) => (
            <li key={tour._id}>
              <h2>{tour.title}</h2>
              <p>{tour.description}</p>
              <p>Category: {tour.category}</p>
              <p>Location: {tour.location?.cities?.join(', ')}, {tour.location?.country}</p>
              <p>Duration: {tour.duration?.days} days, {tour.duration?.nights} nights</p>
              <p>Price: ${tour.pricing?.adult?.price} per adult</p>
              <p>Company: {tour.company?.username}</p>
              <p>Trip Start Date: {new Date(tour.tripStartDate).toLocaleDateString()}</p>
              <p>Trip End Date: {new Date(tour.tripEndDate).toLocaleDateString()}</p>
              <FavoriteButton tourId={tour._id} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default ToursList;
