import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { tourService } from '../../services/tourService';
import { UserContext } from '../../contexts/UserContext';

const TourEdit = () => {
  const { tourId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tour, setTour] = useState(null);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTour();
  }, [tourId]);

  const fetchTour = async () => {
    try {
      const fetchedTour = await tourService.show(tourId);
      
      // Check if user is the owner
      if (fetchedTour.company._id !== user._id) {
        alert("You're not allowed to edit this tour!");
        navigate('/tours');
        return;
      }
      
      setTour(fetchedTour);
      setFormData({
        title: fetchedTour.title,
        description: fetchedTour.description,
        category: fetchedTour.category,
        tripStartDate: fetchedTour.tripStartDate.split('T')[0],
        tripEndDate: fetchedTour.tripEndDate.split('T')[0],
        location: fetchedTour.location,
        pricing: fetchedTour.pricing,
        tourGuides: fetchedTour.tourGuides,
        toursIncluded: fetchedTour.toursIncluded,
        bookingDeadline: fetchedTour.bookingDeadline.split('T')[0],
        duration: fetchedTour.duration,
        isActive: fetchedTour.isActive
      });
    } catch (err) {
      alert('Failed to load tour');
      navigate('/tours');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (evt) => {
    const { name, value, type, checked } = evt.target;
    setErrors({ ...errors, [name]: '' });
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      if (subChild) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setSubmitting(true);

    try {
      await tourService.update(tourId, formData);
      alert('Tour updated successfully!');
      navigate(`/tours/${tourId}`);
    } catch (err) {
      alert(err.message || 'Failed to update tour');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading tour...</div>;
  if (!formData) return <div style={{ padding: '20px' }}>Tour not found</div>;

  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Edit Tour</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor='title' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Tour Title
          </label>
          <input
            required
            type='text'
            name='title'
            id='title'
            value={formData.title}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor='description' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description
          </label>
          <textarea
            required
            name='description'
            id='description'
            value={formData.description}
            onChange={handleChange}
            rows='4'
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor='category' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Category
          </label>
          <select
            required
            name='category'
            id='category'
            value={formData.category}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value='adventure'>Adventure</option>
            <option value='cultural'>Cultural</option>
            <option value='relaxation'>Relaxation</option>
            <option value='business'>Business</option>
            <option value='family'>Family</option>
          </select>
        </div>

        {/* Active Status */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type='checkbox'
              name='isActive'
              checked={formData.isActive}
              onChange={handleChange}
              style={{ marginRight: '10px' }}
            />
            <span style={{ fontWeight: 'bold' }}>Tour is Active</span>
          </label>
        </div>

        {/* Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label htmlFor='tripStartDate' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Start Date
            </label>
            <input
              required
              type='date'
              name='tripStartDate'
              id='tripStartDate'
              value={formData.tripStartDate}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div>
            <label htmlFor='tripEndDate' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              End Date
            </label>
            <input
              required
              type='date'
              name='tripEndDate'
              id='tripEndDate'
              value={formData.tripEndDate}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor='bookingDeadline' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Booking Deadline
          </label>
          <input
            required
            type='date'
            name='bookingDeadline'
            id='bookingDeadline'
            value={formData.bookingDeadline}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        {/* Pricing - Adult */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Adult Pricing</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Price ($)</label>
              <input
                required
                type='number'
                name='pricing.adult.price'
                value={formData.pricing.adult.price}
                onChange={handleChange}
                min='0'
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Available Spots</label>
              <input
                required
                type='number'
                name='pricing.adult.quantity'
                value={formData.pricing.adult.quantity}
                onChange={handleChange}
                min='0'
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button
            type='submit'
            disabled={submitting}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: submitting ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1.1em',
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type='button'
            onClick={() => navigate(`/tours/${tourId}`)}
            disabled={submitting}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
};

export default TourEdit;