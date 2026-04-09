import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container animate-fade-in">
      <div className="header-section text-center">
        <h1 className="title">Who <span className="highlight">We are</span></h1>
        <div className="underline"></div>
      </div>
      
      <div className="content-grid">
        <div className="glass-panel text-content">
          <p>We are a team of students dedicated to creating innovative solutions that contribute to a cleaner and smarter environment. Our project focuses on monitoring and analyzing Air Quality and Traffic Density in urban areas using data-driven and AI-based techniques.</p>
          <p>The main objective of our work is to establish a correlation between traffic patterns and air pollution levels, providing valuable insights for better city planning and pollution control. By integrating real-time data from sensors and environmental parameters, our system can help authorities and citizens make informed decisions for sustainable urban living.</p>
          <p>Through this project, we aim to promote environmental awareness, encourage smart mobility, and contribute to the development of eco-friendly cities. Our vision is to use technology not just to observe problems—but to create impactful solutions that improve everyday life.</p>
        </div>
        
        <div className="journey-section glass-panel">
           <h2 className="title">Journey of Project <span className="highlight">Arc</span></h2>
           <div className="underline"></div>
           <p className="mt-4">Our journey of Project ARC started with the idea of studying air quality and traffic density in cities. We researched how pollution and traffic are connected and how technology can help in monitoring them. Step by step, we collected data, analyzed results, and built our model with teamwork and dedication. Through this project, we learned how small efforts can create a big impact on society and the environment.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
