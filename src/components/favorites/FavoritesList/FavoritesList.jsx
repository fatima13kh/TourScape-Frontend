// src/components/favorites/FavoritesList/FavoritesList.jsx

import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import * as favoritesService from '../../../services/favoritesService';
import './FavoritesList.css';

const FavoritesList = () => {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const fetchedFavorites = await favoritesService.index();
        setFavorites(fetchedFavorites);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (tourId) => {
    try {
      await favoritesService.removeFavorite(tourId);
      setFavorites(favorites.filter(fav => fav._id !== tourId));
      setMessage('Removed from favorites');
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!user) {
    return (
      <main className="favorites-list-container">
        <div className="favorites-list-empty">
          <h1>Favorites</h1>
          <p>Please sign in to view your favorites.</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="favorites-list-container">
        <div className="favorites-loading">
          <h1>Favorites</h1>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="favorites-list-container">
      <div className="favorites-list-header">
        <h1>My Favorites</h1>
      </div>
      {message && <div className="favorites-message success">{message}</div>}

      {favorites.length === 0 ? (
        <div className="favorites-list-empty">
          <p>You have no favorite tours yet.</p>
        </div>
      ) : (
        <ul className="favorites-list">
          {favorites.map((favorite) => {
            const tour = favorite.tour;

            if (!tour) {
              return null;
            }

            return (
              <li key={favorite._id}>
                <h2>{tour.title}</h2>
                <p>{tour.description}</p>
                <p><strong>Category:</strong> {tour.category}</p>
                <p><strong>Location:</strong> {tour.location?.cities?.join(', ')}, {tour.location?.country}</p>
                <p><strong>Duration:</strong> {tour.duration?.days} days, {tour.duration?.nights} nights</p>
                <p><strong>Price:</strong> ${tour.pricing?.adult?.price} per adult</p>
                <p><strong>Company:</strong> {tour.company?.username}</p>
                <p><strong>Trip Start Date:</strong> {new Date(tour.tripStartDate).toLocaleDateString()}</p>
                <p><strong>Trip End Date:</strong> {new Date(tour.tripEndDate).toLocaleDateString()}</p>
                <button onClick={() => handleRemoveFavorite(tour._id)}>
                  Remove from Favorites
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
};

export default FavoritesList;
