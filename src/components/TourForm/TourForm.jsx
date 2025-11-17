import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';

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

  // Auto-calculate duration when dates change
  useEffect(() => {
    if (formData.tripStartDate && formData.tripEndDate) {
      const startDate = new Date(formData.tripStartDate);
      const endDate = new Date(formData.tripEndDate);
      
      // Check if dates are valid and end date is after start date
      if (startDate < endDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const nights = days > 0 ? days - 1 : 0;
        
        setFormData(prev => ({
          ...prev,
          duration: { days, nights }
        }));
      } else {
        // Reset duration if dates are invalid
        setFormData(prev => ({
          ...prev,
          duration: { days: 0, nights: 0 }
        }));
      }
    }
  }, [formData.tripStartDate, formData.tripEndDate]);

  // Authentication check
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
    
    // Convert number inputs to numbers
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

    // Required fields validation
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.tripStartDate) newErrors.tripStartDate = 'Start date is required';
    if (!formData.tripEndDate) newErrors.tripEndDate = 'End date is required';
    if (!formData.bookingDeadline) newErrors.bookingDeadline = 'Booking deadline is required';
    if (!formData.location.country.trim()) newErrors['location.country'] = 'Country is required';
    
    // Date validation
    if (formData.tripStartDate && formData.tripEndDate && new Date(formData.tripStartDate) >= new Date(formData.tripEndDate)) {
      newErrors.tripEndDate = 'End date must be after start date';
    }
    
    if (formData.bookingDeadline && formData.tripStartDate && new Date(formData.bookingDeadline) >= new Date(formData.tripStartDate)) {
      newErrors.bookingDeadline = 'Booking deadline must be before trip start date';
    }

    // Price validation
    if (formData.pricing.adult.price <= 0) newErrors['pricing.adult.price'] = 'Adult price must be greater than 0';
    if (formData.pricing.adult.quantity <= 0) newErrors['pricing.adult.quantity'] = 'Adult quantity must be greater than 0';

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
    setMessage({ type: '', text: '' });
    
    try {
      // Filter out empty array values and format data for API
      const submitData = {
        ...formData,
        location: {
          country: formData.location.country,
          cities: formData.location.cities.filter(city => city.trim() !== '')
        },
        tourGuides: formData.tourGuides.filter(guide => guide.trim() !== ''),
        toursIncluded: formData.toursIncluded.filter(tour => tour.trim() !== ''),
        // Convert dates to ISO string format for backend
        tripStartDate: new Date(formData.tripStartDate).toISOString(),
        tripEndDate: new Date(formData.tripEndDate).toISOString(),
        bookingDeadline: new Date(formData.bookingDeadline).toISOString()
      };

      await props.handleAddTour(submitData);
      setMessage({ type: 'success', text: 'Tour created successfully!' });
      
      // Clear form after success
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
        navigate('/tours');
      }, 2000);
      
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create tour' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Create New Tour</h1>
      
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
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Basic Information */}
        <div>
          <label htmlFor='title' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tour Title</label>
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

        <div>
          <label htmlFor='description' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
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

        <div>
          <label htmlFor='category' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
          <select
            required
            name='category'
            id='category'
            value={formData.category}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value=''>Choose category</option>
            <option value='adventure'>Adventure</option>
            <option value='cultural'>Cultural</option>
            <option value='relaxation'>Relaxation</option>
            <option value='business'>Business</option>
            <option value='family'>Family</option>
          </select>
          {errors.category && <span style={{color: 'red', fontSize: '0.9em'}}>{errors.category}</span>}
        </div>

        {/* Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div>
            <label htmlFor='tripStartDate' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Trip Start Date</label>
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
            <label htmlFor='tripEndDate' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Trip End Date</label>
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
            <label htmlFor='bookingDeadline' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Booking Deadline</label>
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

        {/* Auto-calculated Duration */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
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
        <div>
          <label htmlFor='country' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Country</label>
          <input
            required
            type='text'
            name='location.country'
            id='country'
            value={formData.location.country}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          {errors['location.country'] && <span style={{color: 'red', fontSize: '0.9em'}}>{errors['location.country']}</span>}
        </div>

        <div>
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
        <div>
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
                {errors['pricing.adult.price'] && <span style={{color: 'red', fontSize: '0.9em'}}>{errors['pricing.adult.price']}</span>}
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
                {errors['pricing.adult.quantity'] && <span style={{color: 'red', fontSize: '0.9em'}}>{errors['pricing.adult.quantity']}</span>}
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
        <div>
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
        <div>
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

        <button 
          type='submit'
          disabled={submitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: submitting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1.1em',
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? 'Creating Tour...' : 'CREATE TOUR'}
        </button>
      </form>
    </main>
  );
};

export default TourForm;