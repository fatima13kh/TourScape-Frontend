import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { tourService } from '../../services/tourService';
import './Tours.css';

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
    <main className="tours-container">
      <h1>All Tours</h1>
      
      <div className="filter-section">
        <h3>Filter by Category</h3>
        <div className="filter-buttons">
          <button
            onClick={() => handleCategoryChange('')}
            className={`filter-button ${selectedCategory === '' ? 'active' : ''}`}
          >
            All Tours
          </button>
          <button
            onClick={() => handleCategoryChange('adventure')}
            className={`filter-button ${selectedCategory === 'adventure' ? 'active' : ''}`}
          >
            Adventure
          </button>
          <button
            onClick={() => handleCategoryChange('cultural')}
            className={`filter-button ${selectedCategory === 'cultural' ? 'active' : ''}`}
          >
            Cultural
          </button>
          <button
            onClick={() => handleCategoryChange('relaxation')}
            className={`filter-button ${selectedCategory === 'relaxation' ? 'active' : ''}`}
          >
            Relaxation
          </button>
          <button
            onClick={() => handleCategoryChange('business')}
            className={`filter-button ${selectedCategory === 'business' ? 'active' : ''}`}
          >
            Business
          </button>
          <button
            onClick={() => handleCategoryChange('family')}
            className={`filter-button ${selectedCategory === 'family' ? 'active' : ''}`}
          >
            Family
          </button>
        </div>
      </div>

      <div className="tours-grid">
        {tours.map(tour => (
          <div key={tour._id} className="tour-card">
            <div className="tour-header">
              <div className="tour-content">
                <h3>{tour.title}</h3>
                <p className="tour-company">
                  by <strong>{tour.company?.username}</strong>
                </p>
                <p>{tour.description}</p>
                
                <div className="tour-info-grid">
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

                <div className="tour-info-grid">
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
              
              <div className="tour-actions">
                <Link to={`/tours/${tour._id}`}>
                  <button className="view-details-button">
                    View Details
                  </button>
                </Link>
                <Link to={`/companies/${tour.company?._id}`}>
                  <button className="view-company-button">
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