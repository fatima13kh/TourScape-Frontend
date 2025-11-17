import { useState } from 'react';
import { useNavigate } from 'react-router';
import { bookingService } from '../../services/bookingService';
import './BookingForm.css';

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
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <div className="booking-header">
          <h2>Book {tour.title}</h2>
          <button 
            onClick={onClose}
            className="close-button"
          >
            ×
          </button>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <h3>Select Quantities</h3>
            
            {/* Adults - Always show if adult pricing exists */}
            <div className="quantity-row">
              <div>
                <div className="quantity-label">Adults</div>
                <div className="quantity-info">
                  {tour.pricing.adult?.price ? `${tour.pricing.adult.price} BHD` : 'Free'} • Available: {tour.pricing.adult?.quantity || 0}
                </div>
              </div>
              <input
                type="number"
                min="0"
                max={tour.pricing.adult?.quantity || 0}
                value={quantities.adults}
                onChange={(e) => handleQuantityChange('adults', e.target.value)}
                className="quantity-input"
                required
              />
            </div>

            {/* Children - Show if child pricing exists OR if child quantity is available */}
            {(tour.pricing.child?.price !== undefined || tour.pricing.child?.quantity > 0) && (
              <div className="quantity-row">
                <div>
                  <div className="quantity-label">Children</div>
                  <div className="quantity-info">
                    {tour.pricing.child?.price ? `${tour.pricing.child.price} BHD` : 'Free'} • Available: {tour.pricing.child?.quantity || 0}
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={tour.pricing.child?.quantity || 0}
                  value={quantities.children}
                  onChange={(e) => handleQuantityChange('children', e.target.value)}
                  className="quantity-input"
                />
              </div>
            )}

            {/* Toddlers - Show if toddler pricing exists OR if toddler quantity is available */}
            {(tour.pricing.toddler?.price !== undefined || tour.pricing.toddler?.quantity > 0) && (
              <div className="quantity-row">
                <div>
                  <div className="quantity-label">Toddlers</div>
                  <div className="quantity-info">
                    {tour.pricing.toddler?.price ? `${tour.pricing.toddler.price} BHD` : 'Free'} • Available: {tour.pricing.toddler?.quantity || 0}
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={tour.pricing.toddler?.quantity || 0}
                  value={quantities.toddlers}
                  onChange={(e) => handleQuantityChange('toddlers', e.target.value)}
                  className="quantity-input"
                />
              </div>
            )}

            {/* Babies - Show if baby pricing exists OR if baby quantity is available */}
            {(tour.pricing.baby?.price !== undefined || tour.pricing.baby?.quantity > 0) && (
              <div className="quantity-row">
                <div>
                  <div className="quantity-label">Babies</div>
                  <div className="quantity-info">
                    {tour.pricing.baby?.price ? `${tour.pricing.baby.price} BHD` : 'Free'} • Available: {tour.pricing.baby?.quantity || 0}
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={tour.pricing.baby?.quantity || 0}
                  value={quantities.babies}
                  onChange={(e) => handleQuantityChange('babies', e.target.value)}
                  className="quantity-input"
                />
              </div>
            )}
          </div>

          <div className="total-section">
            <div className="total-display">
              <span>Total:</span>
              <span>{totalPrice} BHD</span>
            </div>
          </div>

          <div className="button-group">
            <button
              type="submit"
              disabled={loading || totalPrice === 0}
              className="confirm-button"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="cancel-button"
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