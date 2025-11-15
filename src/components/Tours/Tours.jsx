import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { tourService } from '../../services/tourService';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    country: '',
    city: '',
    price: ''
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async (filterParams = {}) => {
    try {
      setLoading(true);
      const fetchedTours = await tourService.index(filterParams);
      setTours(fetchedTours);
    } catch (err) {
      setError('Failed to load tours');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchTours(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { category: '', country: '', city: '', price: '' };
    setFilters(emptyFilters);
    fetchTours(emptyFilters);
  };

  if (loading) return <div>Loading tours...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main style={{ padding: '20px' }}>
      <h1>All Tours</h1>
      
      {/* Filters */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3>Filter Tours</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label>Category:</label>
            <select 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">All Categories</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="relaxation">Relaxation</option>
              <option value="business">Business</option>
              <option value="family">Family</option>
            </select>
          </div>
          
          <div>
            <label>Country:</label>
            <input
              type="text"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              placeholder="Enter country"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div>
            <label>City:</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Enter city"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div>
            <label>Max Price:</label>
            <input
              type="number"
              value={filters.price}
              onChange={(e) => handleFilterChange('price', e.target.value)}
              placeholder="Max price"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        </div>
        <button 
          onClick={clearFilters}
          style={{ 
            marginTop: '15px', 
            padding: '8px 16px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Tours List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {tours.map(tour => (
          <div 
            key={tour._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: 'white'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3>{tour.title}</h3>
                <p style={{ margin: '10px 0', color: '#666' }}>
                  by <strong>{tour.company?.username}</strong>
                </p>
                <p style={{ margin: '10px 0' }}>{tour.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', margin: '15px 0' }}>
                  <div>
                    <strong>Category:</strong> {tour.category}
                  </div>
                  <div>
                    <strong>Location:</strong> {tour.location.country}
                  </div>
                  <div>
                    <strong>Duration:</strong> {tour.duration.days} days, {tour.duration.nights} nights
                  </div>
                  <div>
                    <strong>Price:</strong> ${tour.pricing.adult.price} per adult
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', margin: '15px 0' }}>
                  <div>
                    <strong>Start Date:</strong> {new Date(tour.tripStartDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>End Date:</strong> {new Date(tour.tripEndDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Booking Deadline:</strong> {new Date(tour.bookingDeadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div style={{ marginLeft: '20px' }}>
                <Link to={`/tours/${tour._id}`}>
                  <button style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    View Details
                  </button>
                </Link>
                <Link to={`/companies/${tour.company?._id}`}>
                  <button style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#6c757d', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    width: '100%'
                  }}>
                    View Company
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tours.length === 0 && (
        <p>No tours found matching your criteria.</p>
      )}
    </main>
  );
};

export default Tours;