import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { companyService } from '../../services/companyService';

const CompanyDetail = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanyAndTours = async () => {
      try {
        const data = await companyService.show(companyId);
        setCompany(data.company);
        setTours(data.tours);
      } catch (err) {
        setError('Failed to load company details');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyAndTours();
  }, [companyId]);

  if (loading) return <div>Loading company details...</div>;
  if (error) return <div>{error}</div>;
  if (!company) return <div>Company not found</div>;

  return (
    <main style={{ padding: '20px' }}>
      <Link to="/companies" style={{ marginBottom: '20px', display: 'block' }}>
        ← Back to Companies
      </Link>

      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h1>{company.username}</h1>
        {company.description && (
          <p style={{ fontSize: '1.1em', margin: '15px 0' }}>{company.description}</p>
        )}
        <div style={{ margin: '10px 0' }}>
          <strong>Contact Information:</strong>
          <div>Email: {company.email}</div>
          {company.phone && <div>Phone: {company.phone}</div>}
        </div>
      </div>

      <h2>Tours by {company.username}</h2>
      
      {tours.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {tours.map(tour => (
            <div 
              key={tour._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: 'white'
              }}
            >
              <h3>{tour.title}</h3>
              <p style={{ margin: '10px 0' }}>{tour.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', margin: '15px 0' }}>
                <div>
                  <strong>Category:</strong> {tour.category}
                </div>
                <div>
                  <strong>Location:</strong> {tour.location.country}
                </div>
                <div>
                  <strong>Duration:</strong> {tour.duration.days} days, {tour.duration.nights} nights
                </div>
                <div>
                  <strong>Price:</strong> ${tour.pricing.adult.price} per adult
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', margin: '15px 0' }}>
                <div>
                  <strong>Start Date:</strong> {new Date(tour.tripStartDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>End Date:</strong> {new Date(tour.tripEndDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Booking Deadline:</strong> {new Date(tour.bookingDeadline).toLocaleDateString()}
                </div>
              </div>

              {tour.location.cities.length > 0 && (
                <div style={{ margin: '10px 0' }}>
                  <strong>Cities:</strong> {tour.location.cities.join(', ')}
                </div>
              )}

              <Link to={`/tours/${tour._id}`}>
                <button style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}>
                  View Tour Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No tours available from this company.</p>
      )}
    </main>
  );
};

export default CompanyDetail;