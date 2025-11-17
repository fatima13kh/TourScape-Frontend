import { useState } from 'react';
import { useNavigate } from 'react-router';
import { bookingService } from '../../services/bookingService';

const BookingForm = ({ tour, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({
    adults: 1,
    children: 0,
    toddlers: 0,
    babies: 0
  });

  const handleQuantityChange = (category, value) => {
    const numValue = parseInt(value) || 0;
    const maxQuantity = tour.pricing[category]?.quantity || 0;
    
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
      alert('Please select at least one person');
      return;
    }

    setLoading(true);

    try {
      await bookingService.create({
        tourId: tour._id,
        quantities: quantities
      });

      alert('Booking confirmed successfully!');
      
      // Close modal and redirect to profile
      onClose();
      setTimeout(() => {
        navigate('/profile');
      }, 500);
    } catch (err) {
      alert(err.message || 'Booking failed. Please try again.');
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <h3>Select Quantities</h3>
            
            {/* Adults */}
            {tour.pricing.adult && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>Adults</label>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    ${tour.pricing.adult.price} • Available: {tour.pricing.adult.quantity}
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={tour.pricing.adult.quantity}
                  value={quantities.adults}
                  onChange={(e) => handleQuantityChange('adults', e.target.value)}
                  style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  required
                />
              </div>
            )}

            {/* Children */}
            {tour.pricing.child?.price > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>Children</label>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    ${tour.pricing.child.price} • Available: {tour.pricing.child.quantity}
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={tour.pricing.child.quantity}
                  value={quantities.children}
                  onChange={(e) => handleQuantityChange('children', e.target.value)}
                  style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            )}

            {/* Toddlers */}
            {tour.pricing.toddler?.price > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>Toddlers</label>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    ${tour.pricing.toddler.price} • Available: {tour.pricing.toddler.quantity}
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={tour.pricing.toddler.quantity}
                  value={quantities.toddlers}
                  onChange={(e) => handleQuantityChange('toddlers', e.target.value)}
                  style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            )}

            {/* Babies */}
            {tour.pricing.baby?.price > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>Babies</label>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    ${tour.pricing.baby.price} • Available: {tour.pricing.baby.quantity}
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={tour.pricing.baby.quantity}
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
              <span>${totalPrice}</span>
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