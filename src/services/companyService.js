const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/companies`;

export const companyService = {
  // Get all companies
  index: async () => {
    try {
      const res = await fetch(BASE_URL, {
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

  // Get single company with tours
  show: async (companyId) => {
    try {
      const res = await fetch(`${BASE_URL}/${companyId}`, {
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