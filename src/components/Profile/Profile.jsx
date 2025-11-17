import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import { bookingService } from '../../services/bookingService';
import { tourService } from '../../services/tourService';
import './Profile.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Profile = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deletingTourId, setDeletingTourId] = useState(null);

  useEffect(() => {
    if (user.role === 'customer') {
      fetchBookings();
    } else if (user.role === 'tourCompany') {
      fetchCompanyTours();
    }
  }, [user.role]);

  const fetchBookings = async () => {
    try {
      const fetchedBookings = await bookingService.index();
      setBookings(fetchedBookings);
    } catch (err) {
      console.log('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyTours = async () => {
    try {
      const allTours = await tourService.index();
      const companyTours = allTours.filter(tour => tour.company._id === user._id);
      setTours(companyTours);
    } catch (err) {
      console.log('Failed to load company tours:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTourStats = (tour) => {
    if (!tour.attendees || tour.attendees.length === 0) {
      return {
        totalBookings: 0,
        totalRevenue: 0,
        quantities: {
          adults: 0,
          children: 0,
          toddlers: 0,
          babies: 0
        }
      };
    }

    const stats = tour.attendees.reduce((acc, attendee) => {
      acc.totalBookings += 1;
      acc.totalRevenue += attendee.totalPaid;
      acc.quantities.adults += attendee.quantities.adults;
      acc.quantities.children += attendee.quantities.children;
      acc.quantities.toddlers += attendee.quantities.toddlers;
      acc.quantities.babies += attendee.quantities.babies;
      return acc;
    }, {
      totalBookings: 0,
      totalRevenue: 0,
      quantities: {
        adults: 0,
        children: 0,
        toddlers: 0,
        babies: 0
      }
    });

    return stats;
  };

  const handleDeleteTour = async (tourId) => {
    const tour = tours.find(t => t._id === tourId);
    
    if (tour.attendees && tour.attendees.length > 0) {
      setMessage({ type: 'error', text: 'Cannot delete tour with existing bookings' });
      return;
    }

    setDeletingTourId(tourId);
    setMessage({ type: '', text: '' });

    try {
      await tourService.delete(tourId);
      setMessage({ type: 'success', text: 'Tour deleted successfully' });
      setTours(prevTours => prevTours.filter(tour => tour._id !== tourId));
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete tour' });
    } finally {
      setDeletingTourId(null);
    }
  };

  if (loading) return <div className="profile-container">Loading profile...</div>;

  return (
    <>
     <Header />
    <main className="profile-container">
      <h1>Profile</h1>
      
      {/* Success/Error Messages */}
      {message.text && (
        <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
          {message.text}
        </div>
      )}
      
      {/* User Info */}
      <div className="user-info">
        <h2>{user.username}</h2>
        <div>
          <strong>Role:</strong> {user.role}
        </div>
      </div>

      {/* Customer Profile - Bookings */}
      {user.role === 'customer' && (
        <div>
          <h2>My Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">No bookings yet</p>
              <Link to="/">
                <button className="browse-button">
                  Browse Tours
                </button>
              </Link>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking, index) => (
                <div key={booking._id || index} className="booking-card">
                  <div className="booking-content">
                    <div className="booking-details">
                      <h3>{booking.tour?.title}</h3>
                      <p style={{ color: '#666', margin: '10px 0' }}>
                        {booking.tour?.description}
                      </p>
                      
                      <div className="info-grid">
                        <div>
                          <strong>Booking Date:</strong><br />
                          {new Date(booking.bookedAt).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Trip Start:</strong><br />
                          {new Date(booking.tour?.tripStartDate).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Duration:</strong><br />
                          {booking.tour?.duration.days} days, {booking.tour?.duration.nights} nights
                        </div>
                      </div>

                      <div className="quantities-section">
                        <strong>Quantities:</strong>
                        <div className="quantities-list">
                          {booking.quantities.adults > 0 && <span>Adults: {booking.quantities.adults}</span>}
                          {booking.quantities.children > 0 && <span>Children: {booking.quantities.children}</span>}
                          {booking.quantities.toddlers > 0 && <span>Toddlers: {booking.quantities.toddlers}</span>}
                          {booking.quantities.babies > 0 && <span>Babies: {booking.quantities.babies}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="booking-price">
                      <div className="price-amount">
                        {booking.totalPaid} BHD
                      </div>
                      <Link to={`/tours/${booking.tour?._id}`}>
                        <button className="view-tour-button">
                          View Tour
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tour Company Profile - Tour Statistics */}
      {user.role === 'tourCompany' && (
        <div>
          <h2>My Tours & Bookings</h2>
          
          {tours.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">No tours created yet</p>
              <Link to="/tours/new">
                <button className="browse-button">
                  Create Your First Tour
                </button>
              </Link>
            </div>
          ) : (
            <div className="bookings-grid">
              {tours.map((tour) => {
                const stats = calculateTourStats(tour);
                const hasBookings = stats.totalBookings > 0;
                
                return (
                  <div key={tour._id} className="tour-card">
                    <div className="booking-content">
                      <div className="booking-details">
                        <h3>{tour.title}</h3>
                        <p style={{ color: '#666', margin: '10px 0' }}>
                          {tour.description}
                        </p>
                        
                        <div className="info-grid">
                          <div>
                            <strong>Category:</strong><br />
                            {tour.category}
                          </div>
                          <div>
                            <strong>Location:</strong><br />
                            {tour.location.country}
                          </div>
                          <div>
                            <strong>Duration:</strong><br />
                            {tour.duration.days} days, {tour.duration.nights} nights
                          </div>
                          <div>
                            <strong>Status:</strong><br />
                            <span style={{ 
                              color: tour.isActive ? '#28a745' : '#dc3545',
                              fontWeight: 'bold'
                            }}>
                              {tour.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>

                        {/* Booking Statistics */}
                        {hasBookings && (
                          <div className="stats-section">
                            <h4 className="stats-title">Booking Statistics</h4>
                            
                            <div className="stats-grid">
                              <div>
                                <strong>Total Bookings:</strong><br />
                                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{stats.totalBookings}</span>
                              </div>
                              <div>
                                <strong>Total Revenue:</strong><br />
                                <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745' }}>
                                  ${stats.totalRevenue}
                                </span>
                              </div>
                            </div>

                            <div>
                              <strong>Total Attendees:</strong>
                              <div className="quantities-list">
                                {stats.quantities.adults > 0 && (
                                  <span className="attendee-badge">
                                    Adults: {stats.quantities.adults}
                                  </span>
                                )}
                                {stats.quantities.children > 0 && (
                                  <span className="attendee-badge attendee-badge-child">
                                    Children: {stats.quantities.children}
                                  </span>
                                )}
                                {stats.quantities.toddlers > 0 && (
                                  <span className="attendee-badge attendee-badge-toddler">
                                    Toddlers: {stats.quantities.toddlers}
                                  </span>
                                )}
                                {stats.quantities.babies > 0 && (
                                  <span className="attendee-badge attendee-badge-baby">
                                    Babies: {stats.quantities.babies}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {!hasBookings && (
                          <div style={{ 
                            backgroundColor: '#f8f9fa', 
                            padding: '15px', 
                            borderRadius: '4px', 
                            marginTop: '15px',
                            textAlign: 'center',
                            color: '#6c757d'
                          }}>
                            No bookings yet for this tour
                          </div>
                        )}
                      </div>

                      <div className="tour-actions">
                        <Link to={`/tours/${tour._id}`}>
                          <button className="action-button view-tour-button">
                            View Tour
                          </button>
                        </Link>
                        
                        <Link to={`/tours/${tour._id}/edit`}>
                          <button className="action-button edit-button">
                            Edit Tour
                          </button>
                        </Link>

                        {/* Delete Button - Only show if no bookings */}
                        {!hasBookings && (
                          <button 
                            onClick={() => handleDeleteTour(tour._id)}
                            disabled={deletingTourId === tour._id}
                            className={`action-button delete-button ${deletingTourId === tour._id ? 'disabled' : ''}`}
                          >
                            {deletingTourId === tour._id ? 'Deleting...' : 'Delete Tour'}
                          </button>
                        )}

                        {hasBookings && (
                          <div className="cannot-delete">
                            Cannot delete (has bookings)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </main>
    <Footer />
    </>
  );
};

export default Profile;