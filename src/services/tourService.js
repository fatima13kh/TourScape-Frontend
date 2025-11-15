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
  },

  // Get all tours
  index: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const url = queryParams.toString() 
        ? `${BASE_URL}?${queryParams.toString()}`
        : BASE_URL;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.err) throw new Error(data.err);
      return data;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },

  // Get single tour
  show: async (tourId) => {
    try {
      const res = await fetch(`${BASE_URL}/${tourId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.err) throw new Error(data.err);
      return data;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
};