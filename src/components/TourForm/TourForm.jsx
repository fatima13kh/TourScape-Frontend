import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import './TourForm.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const TourForm = (props) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tripStartDate: '',
    tripEndDate: '',
    location: {
      country: '',
      cities: ['']
    },
    pricing: {
      adult: { price: 0, quantity: 0 },
      child: { price: 0, quantity: 0 },
      toddler: { price: 0, quantity: 0 },
      baby: { price: 0, quantity: 0 }
    },
    tourGuides: [''],
    toursIncluded: [''],
    bookingDeadline: '',
    duration: { days: 0, nights: 0 }
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (formData.tripStartDate && formData.tripEndDate) {
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
      } else {
        setFormData(prev => ({
          ...prev,
          duration: { days: 0, nights: 0 }
        }));
      }
    }
  }, [formData.tripStartDate, formData.tripEndDate]);

  if (!user) {
    return (
      <main>
        <h1>Access Denied</h1>
        <p>Please sign in to create a tour.</p>
        <button onClick={() => navigate('/sign-in')}>Sign In</button>
      </main>
    );
  }

  if (user.role !== 'tourCompany') {
    return (
      <main>
        <h1>Access Denied</h1>
        <p>Only tour companies can create tours.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </main>
    );
  }

  const handleChange = (evt) => {
    const { name, value, type } = evt.target;
    setErrors({ ...errors, [name]: '' });
    setMessage({ type: '', text: '' });
    
    const processedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      if (subChild) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: processedValue
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: processedValue
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: processedValue }));
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
    if (!formData.location.country.trim()) newErrors['location.country'] = 'Country is required';
    
    if (formData.tripStartDate && formData.tripEndDate && new Date(formData.tripStartDate) >= new Date(formData.tripEndDate)) {
      newErrors.tripEndDate = 'End date must be after start date';
    }
    
    if (formData.bookingDeadline && formData.tripStartDate && new Date(formData.bookingDeadline) >= new Date(formData.tripStartDate)) {
      newErrors.bookingDeadline = 'Booking deadline must be before trip start date';
    }

    if (formData.pricing.adult.price <= 0) newErrors['pricing.adult.price'] = 'Adult price must be greater than 0';
    if (formData.pricing.adult.quantity <= 0) newErrors['pricing.adult.quantity'] = 'Adult quantity must be greater than 0';

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
    setMessage({ type: '', text: '' });
    
    try {
      const submitData = {
        ...formData,
        location: {
          country: formData.location.country,
          cities: formData.location.cities.filter(city => city.trim() !== '')
        },
        tourGuides: formData.tourGuides.filter(guide => guide.trim() !== ''),
        toursIncluded: formData.toursIncluded.filter(tour => tour.trim() !== ''),
        tripStartDate: new Date(formData.tripStartDate).toISOString(),
        tripEndDate: new Date(formData.tripEndDate).toISOString(),
        bookingDeadline: new Date(formData.bookingDeadline).toISOString()
      };

      await props.handleAddTour(submitData);
      setMessage({ type: 'success', text: 'Tour created successfully!' });
      
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          category: '',
          tripStartDate: '',
          tripEndDate: '',
          location: {
            country: '',
            cities: ['']
          },
          pricing: {
            adult: { price: 0, quantity: 0 },
            child: { price: 0, quantity: 0 },
            toddler: { price: 0, quantity: 0 },
            baby: { price: 0, quantity: 0 }
          },
          tourGuides: [''],
          toursIncluded: [''],
          bookingDeadline: '',
          duration: { days: 0, nights: 0 }
        });
        navigate('/');
      }, 2000);
      
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create tour' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>     
     <Header />
    <main className="tour-form-container">
      <h1>Create New Tour</h1>
      
      {message.text && (
        <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="tour-form">
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
            <option value=''>Choose category</option>
            <option value='adventure'>Adventure</option>
            <option value='cultural'>Cultural</option>
            <option value='relaxation'>Relaxation</option>
            <option value='business'>Business</option>
            <option value='family'>Family</option>
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className="dates-grid">
          <div className="form-group">
            <label htmlFor='tripStartDate'>Trip Start Date</label>
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
            <label htmlFor='tripEndDate'>Trip End Date</label>
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
          {errors['location.country'] && <span className="field-error">{errors['location.country']}</span>}
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

        <div className="pricing-section">
          <h3>Pricing (BHD)</h3>
          
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
                {errors['pricing.adult.price'] && <span className="field-error">{errors['pricing.adult.price']}</span>}
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
                {errors['pricing.adult.quantity'] && <span className="field-error">{errors['pricing.adult.quantity']}</span>}
              </div>
            </div>
          </div>

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

        <button 
          type='submit'
          disabled={submitting}
          className="submit-button"
        >
          {submitting ? 'Creating Tour...' : 'CREATE TOUR'}
        </button>
      </form>
    </main>
    <Footer />
    </>
  );
};

export default TourForm;