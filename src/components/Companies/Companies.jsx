import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { companyService } from '../../services/companyService';
import './Companies.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const fetchedCompanies = await companyService.index();
        setCompanies(fetchedCompanies);
      } catch (err) {
        setError('Failed to load companies');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <div>Loading companies...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Header />
    <main className="companies-container">
      <h1>Tour Companies</h1>
      <p>Browse all our partner tour companies</p>
      
      <div className="company-grid">
        {companies.map(company => (
          <div key={company._id} className="company-card">
            <h3>{company.username}</h3>
            {company.description && (
              <p style={{ margin: '10px 0' }}>{company.description}</p>
            )}
            <div style={{ margin: '10px 0' }}>
              <strong>Contact:</strong>
              <div>Email: {company.email}</div>
              {company.phone && <div>Phone: {company.phone}</div>}
            </div>
            <Link to={`/companies/${company._id}`}>
              <button className="view-tours-button">
                View Tours
              </button>
            </Link>
          </div>
        ))}
      </div>

      {companies.length === 0 && (
        <p>No tour companies found.</p>
      )}
    </main>
    <Footer />
    </>
  );
};

export default Companies;