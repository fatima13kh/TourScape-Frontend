import { useState } from 'react';
import { useNavigate } from 'react-router';
import { bookingService } from '../../services/bookingService';

const BookingForm = ({ tour, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [quantities, setQuantities] = useState({
    adults: 1,
    children: 0,
    toddlers: 0,
    babies: 0
  });

  const handleQuantityChange = (category, value) => {
    const numValue = parseInt(value) || 0;
    
    // Get the correct pricing category - match backend structure
    let maxQuantity = 0;
    if (category === 'adults') {
      maxQuantity = tour.pricing.adult?.quantity || 0;
    } else if (category === 'children') {
      maxQuantity = tour.pricing.child?.quantity || 0;
    } else if (category === 'toddlers') {
      maxQuantity = tour.pricing.toddler?.quantity || 0;
    } else if (category === 'babies') {
      maxQuantity = tour.pricing.baby?.quantity || 0;
    }
    
    setQuantities(prev => ({
      ...prev,
      [category]: Math.max(0, Math.min(numValue, maxQuantity))
    }));
  };

  const calculateTotal = () => {
    const adultTotal = quantities.adults * (tour.pricing.adult?.price || 0);
    const childTotal = quantities.children * (tour.pricing.child?.price || 0);
    const toddlerTotal = quantities.toddlers * (tour.pricing.toddler?.price || 0);
    const babyTotal = quantities.babies * (tour.pricing.baby?.price || 0);
    
    return adultTotal + childTotal + toddlerTotal + babyTotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const totalPrice = calculateTotal();
    
    if (totalPrice === 0) {
      setMessage({ type: 'error', text: 'Please select at least one person' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await bookingService.create({
        tourId: tour._id,
        quantities: quantities
      });

      setMessage({ type: 'success', text: 'Booking confirmed successfully!' });
      
      // Close modal and redirect to profile after success message
      setTimeout(() => {
        onClose();
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Booking failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = calculateTotal();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>Book {tour.title}</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <h3>Select Quantities</h3>
            
            {/* Adults - Always show if adult pricing exists */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div>
                <label style={{ fontWeight: 'bold' }}>Adults</label>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  {tour.pricing.adult?.price ? `${tour.pricing.adult.price} BHD` : 'Free'} • Available: {tour.pricing.adult?.quantity || 0}
                </div>
              </div>
              <input
                type="number"
                min="0"
                max={tour.pricing.adult?.quantity || 0}
                value={quantities.adults}
                onChange={(e) => handleQuantityChange('adults', e.target.value)}
                style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>

            {/* Children - Show if child pricing exists OR if child quantity is available */}
            {(tour.pricing.child?.price !== undefined || tour.pricing.child?.quantity > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>Children</label>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    {tour.pricing.child?.price ? `${tour.pricing.child.price} BHD` : 'Free'} • Available: {tour.pricing.child?.quantity || 0}
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={tour.pricing.child?.quantity || 0}
                  value={quantities.children}
                  onChange={(e) => handleQuantityChange('children', e.target.value)}
                  style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            )}

            {/* Toddlers - Show if toddler pricing exists OR if toddler quantity is available */}
            {(tour.pricing.toddler?.price !== undefined || tour.pricing.toddler?.quantity > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>Toddlers</label>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    {tour.pricing.toddler?.price ? `${tour.pricing.toddler.price} BHD` : 'Free'} • Available: {tour.pricing.toddler?.quantity || 0}
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={tour.pricing.toddler?.quantity || 0}
                  value={quantities.toddlers}
                  onChange={(e) => handleQuantityChange('toddlers', e.target.value)}
                  style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            )}

            {/* Babies - Show if baby pricing exists OR if baby quantity is available */}
            {(tour.pricing.baby?.price !== undefined || tour.pricing.baby?.quantity > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>Babies</label>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    {tour.pricing.baby?.price ? `${tour.pricing.baby.price} BHD` : 'Free'} • Available: {tour.pricing.baby?.quantity || 0}
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={tour.pricing.baby?.quantity || 0}
                  value={quantities.babies}
                  onChange={(e) => handleQuantityChange('babies', e.target.value)}
                  style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            )}
          </div>

          <div style={{ borderTop: '2px solid #ddd', paddingTop: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3em', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>{totalPrice} BHD</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading || totalPrice === 0}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: loading || totalPrice === 0 ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1em',
                cursor: loading || totalPrice === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;