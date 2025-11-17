import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import { bookingService } from '../../services/bookingService';

const Profile = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const fetchedBookings = await bookingService.index();
      setBookings(fetchedBookings);
    } catch (err) {
      alert('Failed to load bookings');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading profile...</div>;

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Profile</h1>
      
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

      {/* Bookings Section */}
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
            <Link to="/tours">
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
    </main>
  );
};

export default Profile;