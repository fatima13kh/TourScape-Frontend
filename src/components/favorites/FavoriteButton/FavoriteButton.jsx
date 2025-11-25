// src/components/favorites/FavoriteButton/FavoriteButton.jsx

import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import * as favoritesService from '../../../services/favoritesService';
import './FavoriteButton.css';

const FavoriteButton = ({ tourId }) => {
  const { user } = useContext(UserContext);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkIfFavorited = async () => {
      if (!user) return;

      try {
        const favorites = await favoritesService.index();
        const favorited = favorites.some(
          fav => fav.tour && fav.tour._id === tourId
        );
        setIsFavorited(favorited);
      } catch (err) {
        console.log(err);
      }
    };

    checkIfFavorited();
  }, [user, tourId]);

  const handleToggleFavorite = async () => {
    setMessage('');
    setLoading(true);

    try {
      if (isFavorited) {
        await favoritesService.removeFavorite(tourId);
        setIsFavorited(false);
        setMessage('Removed from favorites');
      } else {
        await favoritesService.addFavorite(tourId);
        setIsFavorited(true);
        setMessage('Added to favorites');
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="favorite-button-container">
      <button
        className="favorite-button"
        onClick={handleToggleFavorite}
        disabled={loading}
      >
        {loading ? 'Loading...' : isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
      {message && <p className="favorite-message success">{message}</p>}
    </div>
  );
};

export default FavoriteButton;
