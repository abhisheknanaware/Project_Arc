import React, { useState } from 'react';
import axios from 'axios';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    weatherdata: '',
    message: ''
  });
  
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus('Sending...');
      const res = await axios.post('/api/contact/postrequest', formData);
      if(res.data.success) {
        setStatus('Message Sent Successfully!');
        setFormData({ name: '', phoneNumber: '', email: '', weatherdata: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      setStatus('An error occurred.');
    }
  };

  return (
    <div className="contact-container animate-fade-in">
      <div className="contact-wrapper glass-panel">
        <div className="contact-info">
          <h2 className="title">Get in Touch <br/><span className="highlight">With ARC</span></h2>
          <p className="subtitle">Please help us know what requirements you have. Our team will contact you very soon.</p>
          
          <div className="info-items">
             <div className="info-item">
                <span className="material-symbols-outlined icon">call</span>
                <div>
                  <strong>Phone No</strong>
                  <p>(+91) 7499631188</p>
                </div>
             </div>
             <div className="info-item">
                <span className="material-symbols-outlined icon">mail</span>
                <div>
                  <strong>Email Address</strong>
                  <p>arctic.arena2024@gmail.com</p>
                </div>
             </div>
             <div className="info-item">
                <span className="material-symbols-outlined icon">location_on</span>
                <div>
                  <strong>Location</strong>
                  <p>PCCOE, Pune, Maharashtra, India.</p>
                </div>
             </div>
          </div>
        </div>
        
        <div className="contact-form-side">
          <h3>Send a Message</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="input-group">
              <label className="input-label">Name</label>
              <input type="text" name="name" className="input-field" placeholder="Enter your Name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Phone No</label>
                <input type="text" name="phoneNumber" className="input-field" placeholder="Enter your phone" value={formData.phoneNumber} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input type="email" name="email" className="input-field" placeholder="Enter your Email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            
            <div className="input-group">
               <label className="input-label">Purpose of Contact:</label>
               <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="weatherdata" value="weatherdata" checked={formData.weatherdata === 'weatherdata'} onChange={handleChange} />
                    Weather Data
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="weatherdata" value="trafficdata" checked={formData.weatherdata === 'trafficdata'} onChange={handleChange} />
                    Traffic Data
                  </label>
               </div>
            </div>
            
            <div className="input-group">
              <label className="input-label">Message</label>
              <textarea name="message" className="input-field" placeholder="Write your message here" rows="4" value={formData.message} onChange={handleChange} required></textarea>
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send Message</button>
            {status && <p className="status-message">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
