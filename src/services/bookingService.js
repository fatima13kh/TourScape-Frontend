const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/bookings`;

export const bookingService = {
  // Create a new booking
  create: async (bookingData) => {
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      const data = await res.json();
      
      if (data.err) {
        throw new Error(data.err);
      }
      
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // Get user's bookings
  index: async () => {
    try {
      const res = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = await res.json();
      
      if (data.err) {
        throw new Error(data.err);
      }
      
      return data.bookings;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};