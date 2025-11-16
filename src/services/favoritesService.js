// src/services/favoritesService.js

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users/favorites`;

// Get user's favorites
export const index = async () => {
  try {
    const res = await fetch(`${BASE_URL}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// Add tour to favorites
export const addFavorite = async (tourId) => {
  try {
    const res = await fetch(`${BASE_URL}/${tourId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// Remove tour from favorites
export const removeFavorite = async (tourId) => {
  try {
    const res = await fetch(`${BASE_URL}/${tourId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
