import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { tourService } from '../../services/tourService';
import { UserContext } from '../../contexts/UserContext';
import BookingForm from '../BookingForm/BookingForm';
import './TourDetail.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

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
    <>
    <Header />
    <main className="tour-detail-container">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      {/* Success/Error Messages */}
      {message.text && (
        <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
          {message.text}
        </div>
      )}

      <div className="tour-layout">
        {/* Tour Details */}
        <div>
          <h1>{tour.title}</h1>
          <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '20px' }}>
            by <Link to={`/companies/${tour.company?._id}`}>{tour.company?.username}</Link>
          </p>

          {/* Edit/Delete buttons - only show for tour owner */}
          {user && tour.company._id === user._id && (
            <div className="tour-actions">
              <button
                onClick={() => navigate(`/tours/${tourId}/edit`)}
                className="edit-button"
              >
                Edit Tour
              </button>
              <button
                onClick={handleDeleteTour}
                disabled={deleting}
                className="delete-button"
              >
                {deleting ? 'Deleting...' : 'Delete Tour'}
              </button>
            </div>
          )}

          <div className="tour-description">
            <p>{tour.description}</p>
          </div>

          <div className="info-grid">
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
          <div className="booking-section">
            <h3>Book This Tour</h3>
            
            <div className="pricing-info">
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
              className="book-button"
            >
              Book Now
            </button>
          </div>
        )}

        {/* View Details Section - Show for tour companies and unauthenticated users */}
        {(user?.role === 'tourCompany' || !user) && (
          <div className="booking-section">
            <h3>Tour Information</h3>
            
            <div className="pricing-info">
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
                className="signin-button"
              >
                Sign In to Book
              </button>
            )}

            {user?.role === 'tourCompany' && (
              <p className="company-message">
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
    <Footer />
    </>
  );
};

export default TourDetail;