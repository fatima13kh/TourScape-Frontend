// src/components/Landing/Landing.jsx
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Landing = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Header />
      
      <main style={{ 
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        minHeight: '50vh'
      }}>
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#343a40' }}>
            Why Choose TourScape?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginTop: '40px'
          }}>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: '#007bff', marginBottom: '15px' }}>🏔️ Adventure Tours</h3>
              <p>Experience thrilling adventures with expert guides and top-notch equipment.</p>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: '#28a745', marginBottom: '15px' }}>🏛️ Cultural Experiences</h3>
              <p>Immerse yourself in local cultures and traditions with authentic tours.</p>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: '#ffc107', marginBottom: '15px' }}>⭐ Trusted Companies</h3>
              <p>All our tour companies are verified and rated by real travelers.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;