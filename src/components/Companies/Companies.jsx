import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { companyService } from '../../services/companyService';

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
    <main style={{ padding: '20px' }}>
      <h1>Tour Companies</h1>
      <p>Browse all our partner tour companies</p>
      
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {companies.map(company => (
          <div 
            key={company._id} 
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#f9f9f9'
            }}
          >
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
              <button style={{ 
                padding: '10px 20px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
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
  );
};

export default Companies;