import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { tourService } from '../../services/tourService';
import { UserContext } from '../../contexts/UserContext';
import BookingForm from '../BookingForm/BookingForm';

const TourDetail = () => {
  const { tourId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleBookTour = () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
    if (user.role !== 'customer') {
      setMessage({ type: 'error', text: 'Only customers can book tours' });
      return;
    }
    setShowBookingModal(true);
  };

  const handleDeleteTour = async () => {
    if (tour.attendees && tour.attendees.length > 0) {
      setMessage({ type: 'error', text: 'Cannot delete tour with existing bookings' });
      return;
    }

    setDeleting(true);
    setMessage({ type: '', text: '' });

    try {
      await tourService.delete(tourId);
      setMessage({ type: 'success', text: 'Tour deleted successfully' });
      
      // Navigate to home page after success message
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete tour' });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading tour details...</div>;
  if (error) return <div>{error}</div>;
  if (!tour) return <div>Tour not found</div>;

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/" style={{ marginBottom: '20px', display: 'block' }}>
        ← Back to Home
      </Link>

      {/* Success/Error Messages */}
      {message.text && (
        <div style={{
          padding: '12px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          marginBottom: '20px',
          fontSize: '0.95em'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        {/* Tour Details */}
        <div>
          <h1>{tour.title}</h1>
          <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '20px' }}>
            by <Link to={`/companies/${tour.company?._id}`}>{tour.company?.username}</Link>
          </p>

          {/* Edit/Delete buttons - only show for tour owner */}
          {user && tour.company._id === user._id && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => navigate(`/tours/${tourId}/edit`)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ffc107',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Edit Tour
              </button>
              <button
                onClick={handleDeleteTour}
                disabled={deleting}
                style={{
                  padding: '10px 20px',
                  backgroundColor: deleting ? '#6c757d' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {deleting ? 'Deleting...' : 'Delete Tour'}
              </button>
            </div>
          )}

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

        {/* Booking Section - Only show for customers */}
        {user?.role === 'customer' && (
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
            <h3>Book This Tour</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4>Pricing</h4>
              <div style={{ lineHeight: '2' }}>
                <div><strong>Adult:</strong> {tour.pricing.adult.price} BHD (Available: {tour.pricing.adult.quantity})</div>
                {tour.pricing.child?.price > 0 && (
                  <div><strong>Child:</strong> {tour.pricing.child.price} BHD (Available: {tour.pricing.child.quantity})</div>
                )}
                {tour.pricing.toddler?.price > 0 && (
                  <div><strong>Toddler:</strong> {tour.pricing.toddler.price} BHD (Available: {tour.pricing.toddler.quantity})</div>
                )}
                {tour.pricing.baby?.price > 0 && (
                  <div><strong>Baby:</strong> {tour.pricing.baby.price} BHD (Available: {tour.pricing.baby.quantity})</div>
                )}
              </div>
            </div>

            <button
              onClick={handleBookTour}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1em',
                cursor: 'pointer'
              }}
            >
              Book Now
            </button>
          </div>
        )}

        {/* View Details Section - Show for tour companies and unauthenticated users */}
        {(user?.role === 'tourCompany' || !user) && (
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
            <h3>Tour Information</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4>Pricing</h4>
              <div style={{ lineHeight: '2' }}>
                <div><strong>Adult:</strong> {tour.pricing.adult.price} BHD (Available: {tour.pricing.adult.quantity})</div>
                {tour.pricing.child?.price > 0 && (
                  <div><strong>Child:</strong> {tour.pricing.child.price} BHD (Available: {tour.pricing.child.quantity})</div>
                )}
                {tour.pricing.toddler?.price > 0 && (
                  <div><strong>Toddler:</strong> {tour.pricing.toddler.price} BHD (Available: {tour.pricing.toddler.quantity})</div>
                )}
                {tour.pricing.baby?.price > 0 && (
                  <div><strong>Baby:</strong> {tour.pricing.baby.price} BHD (Available: {tour.pricing.baby.quantity})</div>
                )}
              </div>
            </div>

            {!user && (
              <button
                onClick={() => navigate('/sign-in')}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1.1em',
                  cursor: 'pointer'
                }}
              >
                Sign In to Book
              </button>
            )}

            {user?.role === 'tourCompany' && (
              <p style={{ 
                padding: '10px', 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
                textAlign: 'center',
                color: '#856404'
              }}>
                Cannot book tours as a Tour Company 
              </p>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingForm 
          tour={tour} 
          onClose={() => setShowBookingModal(false)} 
        />
      )}
    </main>
  );
};

export default TourDetail;