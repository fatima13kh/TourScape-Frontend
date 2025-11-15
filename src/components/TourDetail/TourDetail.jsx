import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { tourService } from '../../services/tourService';
import { UserContext } from '../../contexts/UserContext';

const TourDetail = () => {
  const { tourId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingQuantities, setBookingQuantities] = useState({
    adults: 1,
    children: 0,
    toddlers: 0,
    babies: 0
  });

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const fetchedTour = await tourService.show(tourId);
        setTour(fetchedTour);
      } catch (err) {
        setError('Failed to load tour details');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  const handleQuantityChange = (category, value) => {
    const numValue = parseInt(value) || 0;
    setBookingQuantities(prev => ({
      ...prev,
      [category]: Math.max(0, numValue)
    }));
  };

  const calculateTotal = () => {
    if (!tour) return 0;
    
    const adultTotal = bookingQuantities.adults * tour.pricing.adult.price;
    const childTotal = bookingQuantities.children * (tour.pricing.child?.price || 0);
    const toddlerTotal = bookingQuantities.toddlers * (tour.pricing.toddler?.price || 0);
    const babyTotal = bookingQuantities.babies * (tour.pricing.baby?.price || 0);
    
    return adultTotal + childTotal + toddlerTotal + babyTotal;
  };

  const handleBookTour = () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
    // Implement booking logic here
    console.log('Booking tour:', { tourId, quantities: bookingQuantities });
    alert('Booking functionality to be implemented!');
  };

  if (loading) return <div>Loading tour details...</div>;
  if (error) return <div>{error}</div>;
  if (!tour) return <div>Tour not found</div>;

  const totalPrice = calculateTotal();

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/tours" style={{ marginBottom: '20px', display: 'block' }}>
        ← Back to Tours
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        {/* Tour Details */}
        <div>
          <h1>{tour.title}</h1>
          <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '20px' }}>
            by <Link to={`/companies/${tour.company?._id}`}>{tour.company?.username}</Link>
          </p>

          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>{tour.description}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div>
              <h3>Tour Information</h3>
              <div style={{ lineHeight: '2' }}>
                <div><strong>Category:</strong> {tour.category}</div>
                <div><strong>Country:</strong> {tour.location.country}</div>
                <div><strong>Cities:</strong> {tour.location.cities.join(', ')}</div>
                <div><strong>Duration:</strong> {tour.duration.days} days, {tour.duration.nights} nights</div>
              </div>
            </div>

            <div>
              <h3>Dates</h3>
              <div style={{ lineHeight: '2' }}>
                <div><strong>Start Date:</strong> {new Date(tour.tripStartDate).toLocaleDateString()}</div>
                <div><strong>End Date:</strong> {new Date(tour.tripEndDate).toLocaleDateString()}</div>
                <div><strong>Booking Deadline:</strong> {new Date(tour.bookingDeadline).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {tour.tourGuides.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h3>Tour Guides</h3>
              <ul>
                {tour.tourGuides.map((guide, index) => (
                  <li key={index}>{guide}</li>
                ))}
              </ul>
            </div>
          )}

          {tour.toursIncluded.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h3>Activities Included</h3>
              <ul>
                {tour.toursIncluded.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Booking Section */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
          <h3>Book This Tour</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <h4>Pricing</h4>
            <div style={{ lineHeight: '2' }}>
              <div><strong>Adult:</strong> ${tour.pricing.adult.price} (Available: {tour.pricing.adult.quantity})</div>
              {tour.pricing.child?.price > 0 && (
                <div><strong>Child:</strong> ${tour.pricing.child.price} (Available: {tour.pricing.child.quantity})</div>
              )}
              {tour.pricing.toddler?.price > 0 && (
                <div><strong>Toddler:</strong> ${tour.pricing.toddler.price} (Available: {tour.pricing.toddler.quantity})</div>
              )}
              {tour.pricing.baby?.price > 0 && (
                <div><strong>Baby:</strong> ${tour.pricing.baby.price} (Available: {tour.pricing.baby.quantity})</div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4>Select Quantities</h4>
            {Object.keys(bookingQuantities).map(category => (
              tour.pricing[category]?.price !== undefined && (
                <div key={category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ textTransform: 'capitalize' }}>
                    {category} (${tour.pricing[category].price})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={tour.pricing[category].quantity}
                    value={bookingQuantities[category]}
                    onChange={(e) => handleQuantityChange(category, e.target.value)}
                    style={{ width: '80px', padding: '5px' }}
                  />
                </div>
              )
            ))}
          </div>

          <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          <button
            onClick={handleBookTour}
            disabled={totalPrice === 0}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: totalPrice === 0 ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1.1em',
              cursor: totalPrice === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {user ? 'Book Now' : 'Sign In to Book'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default TourDetail;