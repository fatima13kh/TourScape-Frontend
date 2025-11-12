// src/components/TourForm/TourForm.jsx
import { useState, useContext } from 'react';
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
    duration: { days: 1, nights: 0 }
  });

  const [errors, setErrors] = useState({});

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
    const { name, value } = evt.target;
    setErrors({ ...errors, [name]: '' });
    
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
      setFormData({ ...formData, [name]: value });
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
    if (formData.duration.days < 1) newErrors['duration.days'] = 'Days must be at least 1';
    if (formData.duration.nights < 0) newErrors['duration.nights'] = 'Nights cannot be negative';

    // Cities validation
    const validCities = formData.location.cities.filter(city => city.trim() !== '');
    if (validCities.length === 0) newErrors.cities = 'At least one city is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (validateForm()) {
      // Filter out empty array values before submitting
      const submitData = {
        ...formData,
        tourGuides: formData.tourGuides.filter(guide => guide.trim() !== ''),
        toursIncluded: formData.toursIncluded.filter(tour => tour.trim() !== ''),
        cities: formData.location.cities.filter(city => city.trim() !== '')
      };
      props.handleAddTour(submitData);
    }
  };

  return (
    <main>
      <h1>Create New Tour</h1>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div>
          <label htmlFor='title'>Tour Title</label>
          <input
            required
            type='text'
            name='title'
            id='title'
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span style={{color: 'red'}}>{errors.title}</span>}
        </div>

        <div>
          <label htmlFor='description'>Description</label>
          <textarea
            required
            name='description'
            id='description'
            value={formData.description}
            onChange={handleChange}
            rows='4'
          />
          {errors.description && <span style={{color: 'red'}}>{errors.description}</span>}
        </div>

        <div>
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
          {errors.category && <span style={{color: 'red'}}>{errors.category}</span>}
        </div>

        {/* Dates */}
        <div>
          <label htmlFor='tripStartDate'>Trip Start Date</label>
          <input
            required
            type='date'
            name='tripStartDate'
            id='tripStartDate'
            value={formData.tripStartDate}
            onChange={handleChange}
          />
          {errors.tripStartDate && <span style={{color: 'red'}}>{errors.tripStartDate}</span>}
        </div>

        <div>
          <label htmlFor='tripEndDate'>Trip End Date</label>
          <input
            required
            type='date'
            name='tripEndDate'
            id='tripEndDate'
            value={formData.tripEndDate}
            onChange={handleChange}
          />
          {errors.tripEndDate && <span style={{color: 'red'}}>{errors.tripEndDate}</span>}
        </div>

        <div>
          <label htmlFor='bookingDeadline'>Booking Deadline</label>
          <input
            required
            type='date'
            name='bookingDeadline'
            id='bookingDeadline'
            value={formData.bookingDeadline}
            onChange={handleChange}
          />
          {errors.bookingDeadline && <span style={{color: 'red'}}>{errors.bookingDeadline}</span>}
        </div>

        {/* Location */}
        <div>
          <label htmlFor='country'>Country</label>
          <input
            required
            type='text'
            name='location.country'
            id='country'
            value={formData.location.country}
            onChange={handleChange}
          />
          {errors['location.country'] && <span style={{color: 'red'}}>{errors['location.country']}</span>}
        </div>

        <div>
          <label>Cities</label>
          {formData.location.cities.map((city, index) => (
            <div key={index}>
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
              />
              {formData.location.cities.length > 1 && (
                <button type='button' onClick={() => {
                  const newCities = formData.location.cities.filter((_, i) => i !== index);
                  setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, cities: newCities }
                  }));
                }}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type='button' onClick={() => {
            setFormData(prev => ({
              ...prev,
              location: { ...prev.location, cities: [...prev.location.cities, ''] }
            }));
          }}>
            Add City
          </button>
          {errors.cities && <span style={{color: 'red'}}>{errors.cities}</span>}
        </div>

        {/* Duration */}
        <div>
          <label htmlFor='days'>Duration (Days)</label>
          <input
            required
            type='number'
            name='duration.days'
            id='days'
            value={formData.duration.days}
            onChange={handleChange}
            min='1'
          />
          {errors['duration.days'] && <span style={{color: 'red'}}>{errors['duration.days']}</span>}
        </div>

        <div>
          <label htmlFor='nights'>Nights</label>
          <input
            required
            type='number'
            name='duration.nights'
            id='nights'
            value={formData.duration.nights}
            onChange={handleChange}
            min='0'
          />
          {errors['duration.nights'] && <span style={{color: 'red'}}>{errors['duration.nights']}</span>}
        </div>

        {/* Pricing */}
        <div>
          <h3>Pricing</h3>
          <div>
            <label htmlFor='adultPrice'>Adult Price ($)</label>
            <input
              required
              type='number'
              name='pricing.adult.price'
              id='adultPrice'
              value={formData.pricing.adult.price}
              onChange={handleChange}
              min='0'
            />
            {errors['pricing.adult.price'] && <span style={{color: 'red'}}>{errors['pricing.adult.price']}</span>}
          </div>

          <div>
            <label htmlFor='adultQuantity'>Adult Quantity</label>
            <input
              required
              type='number'
              name='pricing.adult.quantity'
              id='adultQuantity'
              value={formData.pricing.adult.quantity}
              onChange={handleChange}
              min='0'
            />
            {errors['pricing.adult.quantity'] && <span style={{color: 'red'}}>{errors['pricing.adult.quantity']}</span>}
          </div>
        </div>

        {/* Tour Guides */}
        <div>
          <label>Tour Guides</label>
          {formData.tourGuides.map((guide, index) => (
            <div key={index}>
              <input
                type='text'
                value={guide}
                onChange={(e) => handleArrayChange(index, e.target.value, 'tourGuides')}
                placeholder='Guide name'
              />
              {formData.tourGuides.length > 1 && (
                <button type='button' onClick={() => removeArrayField(index, 'tourGuides')}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type='button' onClick={() => addArrayField('tourGuides')}>
            Add Guide
          </button>
        </div>

        {/* Tours Included */}
        <div>
          <label>Tours Included</label>
          {formData.toursIncluded.map((tour, index) => (
            <div key={index}>
              <input
                type='text'
                value={tour}
                onChange={(e) => handleArrayChange(index, e.target.value, 'toursIncluded')}
                placeholder='Tour activity'
              />
              {formData.toursIncluded.length > 1 && (
                <button type='button' onClick={() => removeArrayField(index, 'toursIncluded')}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type='button' onClick={() => addArrayField('toursIncluded')}>
            Add Activity
          </button>
        </div>

        <button type='submit'>CREATE TOUR</button>
      </form>
    </main>
  );
};

export default TourForm;