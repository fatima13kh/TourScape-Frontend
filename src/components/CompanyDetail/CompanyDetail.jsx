import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { companyService } from '../../services/companyService';
import './CompanyDetail.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

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

  if (loading) return (
    <>
      <Header />
      <div>Loading company details...</div>
      <Footer />
    </>
  );
  
  if (error) return (
    <>
      <Header />
      <div>{error}</div>
      <Footer />
    </>
  );
  
  if (!company) return (
    <>
      <Header />
      <div>Company not found</div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <main className="company-detail-container">
        <Link to="/companies" className="back-link">
          ← Back to Companies
        </Link>

        <div className="company-header">
          <h1>{company.username}</h1>
          {company.description && (
            <p className="company-description">{company.description}</p>
          )}
          <div className="contact-info">
            <strong>Contact Information:</strong>
            <div>Email: {company.email}</div>
            {company.phone && <div>Phone: {company.phone}</div>}
          </div>
        </div>

        <h2>Tours by {company.username}</h2>
        
        {tours.length > 0 ? (
          <div className="tours-grid">
            {tours.map(tour => (
              <div key={tour._id} className="tour-card">
                <h3>{tour.title}</h3>
                <p style={{ margin: '10px 0' }}>{tour.description}</p>
                
                <div className="tour-info-grid">
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

                <div className="tour-info-grid">
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
                  <button className="view-details-button">
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
      <Footer />
    </>
  );
};

export default CompanyDetail;