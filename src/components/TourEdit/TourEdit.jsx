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

  // Calculate duration when dates change
  useEffect(() => {
    if (formData?.tripStartDate && formData?.tripEndDate) {
      const startDate = new Date(formData.tripStartDate);
      const endDate = new Date(formData.tripEndDate);
      
      if (startDate < endDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const nights = days > 0 ? days - 1 : 0;
        
        setFormData(prev => ({
          ...prev,
          duration: { days, nights }
        }));
      }
    }
  }, [formData?.tripStartDate, formData?.tripEndDate]);

  const fetchTour = async () => {
    try {
      const fetchedTour = await tourService.show(tourId);
      
      // Check if user is the owner
      if (fetchedTour.company._id !== user._id) {
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

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayField = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.tripStartDate) newErrors.tripStartDate = 'Start date is required';
    if (!formData.tripEndDate) newErrors.tripEndDate = 'End date is required';
    if (!formData.bookingDeadline) newErrors.bookingDeadline = 'Booking deadline is required';
    if (!formData.location.country.trim()) newErrors.country = 'Country is required';
    
    // Date validation
    if (formData.tripStartDate && formData.tripEndDate && 
        new Date(formData.tripStartDate) >= new Date(formData.tripEndDate)) {
      newErrors.tripEndDate = 'End date must be after start date';
    }
    
    if (formData.bookingDeadline && formData.tripStartDate && 
        new Date(formData.bookingDeadline) >= new Date(formData.tripStartDate)) {
      newErrors.bookingDeadline = 'Booking deadline must be before trip start date';
    }

    // Price validation
    if (formData.pricing.adult.price <= 0) newErrors.adultPrice = 'Adult price must be greater than 0';
    if (formData.pricing.adult.quantity <= 0) newErrors.adultQuantity = 'Adult quantity must be greater than 0';

    // Duration validation
    if (formData.duration.days < 1) newErrors.duration = 'Trip must be at least 1 day long';

    // Cities validation
    const validCities = formData.location.cities.filter(city => city.trim() !== '');
    if (validCities.length === 0) newErrors.cities = 'At least one city is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);

    try {
      await tourService.update(tourId, formData);
      navigate(`/tours/${tourId}`);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to update tour' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading tour...</div>;
  if (!formData) return <div style={{ padding: '20px' }}>Tour not found</div>;

  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Edit Tour</h1>
      
      {/* Error Message Display */}
      {errors.submit && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {errors.submit}
        </div>
      )}
      
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
          {errors.title && <span style={{color: 'red', fontSize: '0.9em'}}>{errors.title}</span>}
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
          {errors.description && <span style={{color: 'red', fontSize: '0.9em'}}>{errors.description}</span>}
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
          {errors.category && <span style={{color: 'red', fontSize: '0.9em'}}>{errors.category}</span>}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
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
            {errors.tripStartDate && <span style={{color: 'red', fontSize: '0.9em'}}>{errors.tripStartDate}</span>}
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
            {errors.tripEndDate && <span style={{color: 'red', fontSize: '0.9em'}}>{errors.tripEndDate}</span>}
          </div>

          <div>
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
            {errors.bookingDeadline && <span style={{color: 'red', fontSize: '0.9em'}}>{errors.bookingDeadline}</span>}
          </div>
        </div>

        {/* Duration (Auto-calculated) */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Duration (Auto-calculated)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Days</label>
              <input
                type='number'
                value={formData.duration.days}
                readOnly
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#e9ecef' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nights</label>
              <input
                type='number'
                value={formData.duration.nights}
                readOnly
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#e9ecef' }}
              />
            </div>
          </div>
          {errors.duration && <span style={{color: 'red', fontSize: '0.9em', display: 'block', marginTop: '10px'}}>{errors.duration}</span>}
        </div>

        {/* Location */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor='country' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Country
          </label>
          <input
            required
            type='text'
            name='location.country'
            id='country'
            value={formData.location.country}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          {errors.country && <span style={{color: 'red', fontSize: '0.9em'}}>{errors.country}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Cities</label>
          {formData.location.cities.map((city, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type='text'
                value={city}
                onChange={(e) => {
                  const newCities = [...formData.location.cities];
                  newCities[index] = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, cities: newCities }
                  }));
                }}
                placeholder='City name'
                style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              {formData.location.cities.length > 1 && (
                <button 
                  type='button' 
                  onClick={() => {
                    const newCities = formData.location.cities.filter((_, i) => i !== index);
                    setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, cities: newCities }
                    }));
                  }}
                  style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            type='button' 
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                location: { ...prev.location, cities: [...prev.location.cities, ''] }
              }));
            }}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add City
          </button>
          {errors.cities && <span style={{color: 'red', fontSize: '0.9em', display: 'block', marginTop: '10px'}}>{errors.cities}</span>}
        </div>

        {/* Pricing - All Categories */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Pricing (BHD)</h3>
          
          {/* Adult Pricing */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Adult</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Price (BHD)</label>
                <input
                  required
                  type='number'
                  name='pricing.adult.price'
                  value={formData.pricing.adult.price}
                  onChange={handleChange}
                  min='0'
                  step='0.01'
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                {errors.adultPrice && <span style={{color: 'red', fontSize: '0.9em'}}>{errors.adultPrice}</span>}
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
                {errors.adultQuantity && <span style={{color: 'red', fontSize: '0.9em'}}>{errors.adultQuantity}</span>}
              </div>
            </div>
          </div>

          {/* Child Pricing */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Child</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Price (BHD)</label>
                <input
                  type='number'
                  name='pricing.child.price'
                  value={formData.pricing.child.price}
                  onChange={handleChange}
                  min='0'
                  step='0.01'
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Available Spots</label>
                <input
                  type='number'
                  name='pricing.child.quantity'
                  value={formData.pricing.child.quantity}
                  onChange={handleChange}
                  min='0'
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>

          {/* Toddler Pricing */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Toddler</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Price (BHD)</label>
                <input
                  type='number'
                  name='pricing.toddler.price'
                  value={formData.pricing.toddler.price}
                  onChange={handleChange}
                  min='0'
                  step='0.01'
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Available Spots</label>
                <input
                  type='number'
                  name='pricing.toddler.quantity'
                  value={formData.pricing.toddler.quantity}
                  onChange={handleChange}
                  min='0'
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>

          {/* Baby Pricing */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Baby</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Price (BHD)</label>
                <input
                  type='number'
                  name='pricing.baby.price'
                  value={formData.pricing.baby.price}
                  onChange={handleChange}
                  min='0'
                  step='0.01'
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Available Spots</label>
                <input
                  type='number'
                  name='pricing.baby.quantity'
                  value={formData.pricing.baby.quantity}
                  onChange={handleChange}
                  min='0'
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tour Guides */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tour Guides</label>
          {formData.tourGuides.map((guide, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type='text'
                value={guide}
                onChange={(e) => handleArrayChange(index, e.target.value, 'tourGuides')}
                placeholder='Guide name'
                style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              {formData.tourGuides.length > 1 && (
                <button 
                  type='button' 
                  onClick={() => removeArrayField(index, 'tourGuides')}
                  style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            type='button' 
            onClick={() => addArrayField('tourGuides')}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Guide
          </button>
        </div>

        {/* Tours Included */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tours Included</label>
          {formData.toursIncluded.map((tour, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type='text'
                value={tour}
                onChange={(e) => handleArrayChange(index, e.target.value, 'toursIncluded')}
                placeholder='Tour activity'
                style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              {formData.toursIncluded.length > 1 && (
                <button 
                  type='button' 
                  onClick={() => removeArrayField(index, 'toursIncluded')}
                  style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            type='button' 
            onClick={() => addArrayField('toursIncluded')}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Activity
          </button>
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