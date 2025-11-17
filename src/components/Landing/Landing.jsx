import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Landing.css';

const Landing = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Header />
      
      <main className="landing-container">
        <div className="features-section">
          <h2 className="features-title">Why Choose TourScape?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">🏔️ Adventure Tours</h3>
              <p>Experience thrilling adventures with expert guides and top-notch equipment.</p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title feature-title-cultural">🏛️ Cultural Experiences</h3>
              <p>Immerse yourself in local cultures and traditions with authentic tours.</p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title feature-title-trusted">⭐ Trusted Companies</h3>
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