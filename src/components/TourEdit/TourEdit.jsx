import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { tourService } from '../../services/tourService';
import { UserContext } from '../../contexts/UserContext';
import './TourEdit.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

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
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.tripStartDate) newErrors.tripStartDate = 'Start date is required';
    if (!formData.tripEndDate) newErrors.tripEndDate = 'End date is required';
    if (!formData.bookingDeadline) newErrors.bookingDeadline = 'Booking deadline is required';
    if (!formData.location.country.trim()) newErrors.country = 'Country is required';
    
    if (formData.tripStartDate && formData.tripEndDate && 
        new Date(formData.tripStartDate) >= new Date(formData.tripEndDate)) {
      newErrors.tripEndDate = 'End date must be after start date';
    }
    
    if (formData.bookingDeadline && formData.tripStartDate && 
        new Date(formData.bookingDeadline) >= new Date(formData.tripStartDate)) {
      newErrors.bookingDeadline = 'Booking deadline must be before trip start date';
    }

    if (formData.pricing.adult.price <= 0) newErrors.adultPrice = 'Adult price must be greater than 0';
    if (formData.pricing.adult.quantity <= 0) newErrors.adultQuantity = 'Adult quantity must be greater than 0';

    if (formData.duration.days < 1) newErrors.duration = 'Trip must be at least 1 day long';

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

  if (loading) return <div className="tour-edit-container">Loading tour...</div>;
  if (!formData) return <div className="tour-edit-container">Tour not found</div>;

  return (
    <>
      <Header />
    <main className="tour-edit-container">
      <h1>Edit Tour</h1>
      
      {errors.submit && (
        <div className="error-message">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="edit-form">
        {/* Basic Information */}
        <div className="form-group">
          <label htmlFor='title'>Tour Title</label>
          <input
            required
            type='text'
            name='title'
            id='title'
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor='description'>Description</label>
          <textarea
            required
            name='description'
            id='description'
            value={formData.description}
            onChange={handleChange}
            rows='4'
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor='category'>Category</label>
          <select
            required
            name='category'
            id='category'
            value={formData.category}
            onChange={handleChange}
          >
            <option value='adventure'>Adventure</option>
            <option value='cultural'>Cultural</option>
            <option value='relaxation'>Relaxation</option>
            <option value='business'>Business</option>
            <option value='family'>Family</option>
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        {/* Active Status */}
        <div className="form-group">
          <label className="checkbox-group">
            <input
              type='checkbox'
              name='isActive'
              checked={formData.isActive}
              onChange={handleChange}
            />
            <span>Tour is Active</span>
          </label>
        </div>

        {/* Dates */}
        <div className="dates-grid">
          <div className="form-group">
            <label htmlFor='tripStartDate'>Start Date</label>
            <input
              required
              type='date'
              name='tripStartDate'
              id='tripStartDate'
              value={formData.tripStartDate}
              onChange={handleChange}
            />
            {errors.tripStartDate && <span className="field-error">{errors.tripStartDate}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor='tripEndDate'>End Date</label>
            <input
              required
              type='date'
              name='tripEndDate'
              id='tripEndDate'
              value={formData.tripEndDate}
              onChange={handleChange}
            />
            {errors.tripEndDate && <span className="field-error">{errors.tripEndDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor='bookingDeadline'>Booking Deadline</label>
            <input
              required
              type='date'
              name='bookingDeadline'
              id='bookingDeadline'
              value={formData.bookingDeadline}
              onChange={handleChange}
            />
            {errors.bookingDeadline && <span className="field-error">{errors.bookingDeadline}</span>}
          </div>
        </div>

        {/* Duration (Auto-calculated) */}
        <div className="duration-section">
          <h3>Duration (Auto-calculated)</h3>
          <div className="duration-grid">
            <div className="form-group">
              <label>Days</label>
              <input
                type='number'
                value={formData.duration.days}
                readOnly
                className="duration-input"
              />
            </div>
            <div className="form-group">
              <label>Nights</label>
              <input
                type='number'
                value={formData.duration.nights}
                readOnly
                className="duration-input"
              />
            </div>
          </div>
          {errors.duration && <span className="field-error">{errors.duration}</span>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor='country'>Country</label>
          <input
            required
            type='text'
            name='location.country'
            id='country'
            value={formData.location.country}
            onChange={handleChange}
          />
          {errors.country && <span className="field-error">{errors.country}</span>}
        </div>

        <div className="form-group">
          <label>Cities</label>
          {formData.location.cities.map((city, index) => (
            <div key={index} className="array-item">
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
                className="array-input"
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
                  className="remove-button"
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
            className="add-button"
          >
            Add City
          </button>
          {errors.cities && <span className="field-error">{errors.cities}</span>}
        </div>

        {/* Pricing - All Categories */}
        <div className="pricing-section">
          <h3>Pricing (BHD)</h3>
          
          {/* Adult Pricing */}
          <div className="pricing-category">
            <h4>Adult</h4>
            <div className="pricing-grid">
              <div className="form-group">
                <label>Price (BHD)</label>
                <input
                  required
                  type='number'
                  name='pricing.adult.price'
                  value={formData.pricing.adult.price}
                  onChange={handleChange}
                  min='0'
                  step='0.01'
                />
                {errors.adultPrice && <span className="field-error">{errors.adultPrice}</span>}
              </div>
              <div className="form-group">
                <label>Available Spots</label>
                <input
                  required
                  type='number'
                  name='pricing.adult.quantity'
                  value={formData.pricing.adult.quantity}
                  onChange={handleChange}
                  min='0'
                />
                {errors.adultQuantity && <span className="field-error">{errors.adultQuantity}</span>}
              </div>
            </div>
          </div>

          {/* Child Pricing */}
          <div className="pricing-category">
            <h4>Child</h4>
            <div className="pricing-grid">
              <div className="form-group">
                <label>Price (BHD)</label>
                <input
                  type='number'
                  name='pricing.child.price'
                  value={formData.pricing.child.price}
                  onChange={handleChange}
                  min='0'
                  step='0.01'
                />
              </div>
              <div className="form-group">
                <label>Available Spots</label>
                <input
                  type='number'
                  name='pricing.child.quantity'
                  value={formData.pricing.child.quantity}
                  onChange={handleChange}
                  min='0'
                />
              </div>
            </div>
          </div>

          {/* Toddler Pricing */}
          <div className="pricing-category">
            <h4>Toddler</h4>
            <div className="pricing-grid">
              <div className="form-group">
                <label>Price (BHD)</label>
                <input
                  type='number'
                  name='pricing.toddler.price'
                  value={formData.pricing.toddler.price}
                  onChange={handleChange}
                  min='0'
                  step='0.01'
                />
              </div>
              <div className="form-group">
                <label>Available Spots</label>
                <input
                  type='number'
                  name='pricing.toddler.quantity'
                  value={formData.pricing.toddler.quantity}
                  onChange={handleChange}
                  min='0'
                />
              </div>
            </div>
          </div>

          {/* Baby Pricing */}
          <div className="pricing-category">
            <h4>Baby</h4>
            <div className="pricing-grid">
              <div className="form-group">
                <label>Price (BHD)</label>
                <input
                  type='number'
                  name='pricing.baby.price'
                  value={formData.pricing.baby.price}
                  onChange={handleChange}
                  min='0'
                  step='0.01'
                />
              </div>
              <div className="form-group">
                <label>Available Spots</label>
                <input
                  type='number'
                  name='pricing.baby.quantity'
                  value={formData.pricing.baby.quantity}
                  onChange={handleChange}
                  min='0'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tour Guides */}
        <div className="form-group">
          <label>Tour Guides</label>
          {formData.tourGuides.map((guide, index) => (
            <div key={index} className="array-item">
              <input
                type='text'
                value={guide}
                onChange={(e) => handleArrayChange(index, e.target.value, 'tourGuides')}
                placeholder='Guide name'
                className="array-input"
              />
              {formData.tourGuides.length > 1 && (
                <button 
                  type='button' 
                  onClick={() => removeArrayField(index, 'tourGuides')}
                  className="remove-button"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            type='button' 
            onClick={() => addArrayField('tourGuides')}
            className="add-button"
          >
            Add Guide
          </button>
        </div>

        {/* Tours Included */}
        <div className="form-group">
          <label>Tours Included</label>
          {formData.toursIncluded.map((tour, index) => (
            <div key={index} className="array-item">
              <input
                type='text'
                value={tour}
                onChange={(e) => handleArrayChange(index, e.target.value, 'toursIncluded')}
                placeholder='Tour activity'
                className="array-input"
              />
              {formData.toursIncluded.length > 1 && (
                <button 
                  type='button' 
                  onClick={() => removeArrayField(index, 'toursIncluded')}
                  className="remove-button"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            type='button' 
            onClick={() => addArrayField('toursIncluded')}
            className="add-button"
          >
            Add Activity
          </button>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type='submit'
            disabled={submitting}
            className="save-button"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type='button'
            onClick={() => navigate(`/tours/${tourId}`)}
            disabled={submitting}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
    <Footer />
    </>
  );
};

export default TourEdit;