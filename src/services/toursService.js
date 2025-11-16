// src/services/toursService.js

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/tours`;

// Get all tours
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

// Get single tour
export const show = async (tourId) => {
  try {
    const res = await fetch(`${BASE_URL}/${tourId}`, {
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
