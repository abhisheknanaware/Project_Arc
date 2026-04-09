import React from 'react';

const Footer = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Project ARC. All rights reserved.</p>
      <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Monitoring Air Quality and Traffic Density for a smarter environment.</p>
    </footer>
  );
};

export default Footer;
