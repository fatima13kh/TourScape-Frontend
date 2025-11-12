// src/services/tourService.js
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/tours`;

export const tourService = {
  create: async (tourFormData) => {
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourFormData),
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }
};