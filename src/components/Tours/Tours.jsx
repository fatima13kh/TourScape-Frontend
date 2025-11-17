import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { tourService } from '../../services/tourService';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async (category = '') => {
    try {
      setLoading(true);
      const filterParams = category ? { category } : {};
      const fetchedTours = await tourService.index(filterParams);
      setTours(fetchedTours);
    } catch (err) {
      setError('Failed to load tours');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchTours(category);
  };

  if (loading) return <div>Loading tours...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main style={{ padding: '20px' }}>
      <h1>All Tours</h1>
      
      {/* Category Filter */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3>Filter by Category</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => handleCategoryChange('')}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedCategory === '' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            All Tours
          </button>
          <button
            onClick={() => handleCategoryChange('adventure')}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedCategory === 'adventure' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Adventure
          </button>
          <button
            onClick={() => handleCategoryChange('cultural')}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedCategory === 'cultural' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cultural
          </button>
          <button
            onClick={() => handleCategoryChange('relaxation')}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedCategory === 'relaxation' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Relaxation
          </button>
          <button
            onClick={() => handleCategoryChange('business')}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedCategory === 'business' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Business
          </button>
          <button
            onClick={() => handleCategoryChange('family')}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedCategory === 'family' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Family
          </button>
        </div>
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
        <p>No tours found{selectedCategory && ` in ${selectedCategory} category`}.</p>
      )}
    </main>
  );
};

export default Tours;