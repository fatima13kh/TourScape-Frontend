import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import { bookingService } from '../../services/bookingService';
import { tourService } from '../../services/tourService';

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
      // Filter tours to only show the ones created by this company
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
      // Remove the deleted tour from the list
      setTours(prevTours => prevTours.filter(tour => tour._id !== tourId));
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete tour' });
    } finally {
      setDeletingTourId(null);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading profile...</div>;

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Profile</h1>
      
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
      
      {/* User Info */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2>{user.username}</h2>
        <div style={{ marginTop: '10px' }}>
          <strong>Email:</strong> {user.email || 'N/A'}
        </div>
        <div style={{ marginTop: '5px' }}>
          <strong>Role:</strong> {user.role}
        </div>
      </div>

      {/* Customer Profile - Bookings */}
      {user.role === 'customer' && (
        <div>
          <h2>My Bookings</h2>
          
          {bookings.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px' 
            }}>
              <p style={{ fontSize: '1.2em', color: '#666' }}>No bookings yet</p>
              <Link to="/">
                <button style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Browse Tours
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {bookings.map((booking, index) => (
                <div 
                  key={booking._id || index}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h3>{booking.tour?.title}</h3>
                      <p style={{ color: '#666', margin: '10px 0' }}>
                        {booking.tour?.description}
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', margin: '15px 0' }}>
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

                      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px', marginTop: '15px' }}>
                        <strong>Quantities:</strong>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                          {booking.quantities.adults > 0 && <span>Adults: {booking.quantities.adults}</span>}
                          {booking.quantities.children > 0 && <span>Children: {booking.quantities.children}</span>}
                          {booking.quantities.toddlers > 0 && <span>Toddlers: {booking.quantities.toddlers}</span>}
                          {booking.quantities.babies > 0 && <span>Babies: {booking.quantities.babies}</span>}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginLeft: '20px', textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#28a745' }}>
                        ${booking.totalPaid}
                      </div>
                      <Link to={`/tours/${booking.tour?._id}`}>
                        <button style={{
                          marginTop: '15px',
                          padding: '8px 16px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}>
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
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px' 
            }}>
              <p style={{ fontSize: '1.2em', color: '#666' }}>No tours created yet</p>
              <Link to="/tours/new">
                <button style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Create Your First Tour
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {tours.map((tour) => {
                const stats = calculateTourStats(tour);
                const hasBookings = stats.totalBookings > 0;
                
                return (
                  <div 
                    key={tour._id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '20px',
                      backgroundColor: 'white'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h3>{tour.title}</h3>
                        <p style={{ color: '#666', margin: '10px 0' }}>
                          {tour.description}
                        </p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', margin: '15px 0' }}>
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
                          <div style={{ 
                            backgroundColor: '#e8f5e8', 
                            padding: '15px', 
                            borderRadius: '4px', 
                            marginTop: '15px',
                            border: '1px solid #28a745'
                          }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#155724' }}>Booking Statistics</h4>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
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
                              <div style={{ display: 'flex', gap: '20px', marginTop: '10px', flexWrap: 'wrap' }}>
                                {stats.quantities.adults > 0 && (
                                  <span style={{ backgroundColor: '#007bff', color: 'white', padding: '5px 10px', borderRadius: '4px' }}>
                                    Adults: {stats.quantities.adults}
                                  </span>
                                )}
                                {stats.quantities.children > 0 && (
                                  <span style={{ backgroundColor: '#28a745', color: 'white', padding: '5px 10px', borderRadius: '4px' }}>
                                    Children: {stats.quantities.children}
                                  </span>
                                )}
                                {stats.quantities.toddlers > 0 && (
                                  <span style={{ backgroundColor: '#ffc107', color: 'black', padding: '5px 10px', borderRadius: '4px' }}>
                                    Toddlers: {stats.quantities.toddlers}
                                  </span>
                                )}
                                {stats.quantities.babies > 0 && (
                                  <span style={{ backgroundColor: '#6c757d', color: 'white', padding: '5px 10px', borderRadius: '4px' }}>
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

                      <div style={{ marginLeft: '20px', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link to={`/tours/${tour._id}`}>
                          <button style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            width: '120px'
                          }}>
                            View Tour
                          </button>
                        </Link>
                        
                        <Link to={`/tours/${tour._id}/edit`}>
                          <button style={{
                            padding: '8px 16px',
                            backgroundColor: '#ffc107',
                            color: 'black',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            width: '120px'
                          }}>
                            Edit Tour
                          </button>
                        </Link>

                        {/* Delete Button - Only show if no bookings */}
                        {!hasBookings && (
                          <button 
                            onClick={() => handleDeleteTour(tour._id)}
                            disabled={deletingTourId === tour._id}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: deletingTourId === tour._id ? '#6c757d' : '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: deletingTourId === tour._id ? 'not-allowed' : 'pointer',
                              width: '120px'
                            }}
                          >
                            {deletingTourId === tour._id ? 'Deleting...' : 'Delete Tour'}
                          </button>
                        )}

                        {hasBookings && (
                          <div style={{
                            padding: '8px 16px',
                            backgroundColor: '#f8f9fa',
                            color: '#6c757d',
                            border: '1px solid #dee2e6',
                            borderRadius: '4px',
                            fontSize: '0.8em',
                            textAlign: 'center',
                            width: '120px'
                          }}>
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
  );
};

export default Profile;