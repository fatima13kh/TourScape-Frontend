import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3 className="footer-title">TourScape</h3>
        <p className="footer-description">
          Your gateway to unforgettable travel experiences
        </p>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TourScape. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;