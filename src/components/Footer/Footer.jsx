// src/components/Footer/Footer.jsx
const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#343a40',
      color: 'white',
      textAlign: 'center',
      padding: '30px 20px',
      marginTop: '50px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h3 style={{ marginBottom: '15px', color: '#f8f9fa' }}>TourScape</h3>
        <p style={{ marginBottom: '20px', color: '#adb5bd' }}>
          Your gateway to unforgettable travel experiences
        </p>
        <div style={{
          borderTop: '1px solid #495057',
          paddingTop: '20px',
          color: '#6c757d'
        }}>
          <p>&copy; {new Date().getFullYear()} TourScape. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;