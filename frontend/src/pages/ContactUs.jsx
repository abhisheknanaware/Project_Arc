import React, { useState } from 'react';
import axios from 'axios';
import './ContactUs.css';

const PURPOSE_OPTIONS = [
  { value: 'weatherdata', label: 'Weather Data',  icon: 'cloud' },
  { value: 'trafficdata', label: 'Traffic Data',  icon: 'directions_car' },
  { value: 'partnership', label: 'Partnership',   icon: 'handshake' },
  { value: 'other',       label: 'Other',          icon: 'help_outline' },
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '', phoneNumber: '', email: '', weatherdata: '', message: ''
  });
  const [status, setStatus] = useState(''); // 'sending' | 'success' | 'error' | ''

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus('sending');
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/contact/postrequest', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setStatus('success');
        setFormData({ name: '', phoneNumber: '', email: '', weatherdata: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="cu-page animate-fade-in">

      {/* ── Hero ── */}
      <section className="cu-hero">
        <div className="cu-hero-orb cu-orb1" />
        <div className="cu-hero-orb cu-orb2" />
        <div className="cu-hero-grid" />
        <div className="cu-hero-content">
          <span className="badge-cu">Say Hello</span>
          <h1>Let's <span className="cu-hl">Talk</span></h1>
          <p>Have a question, research inquiry, or partnership idea? We'd love to hear from you.</p>
        </div>
      </section>

      {/* ── Main contact panel ── */}
      <section className="cu-main">
        <div className="cu-wrapper">

          {/* Left — contact info */}
          <div className="cu-info">
            <div className="cu-info-header">
              <h2>Get in Touch <br /><span className="cu-hl">With ARC</span></h2>
              <p>Our team typically responds within 24 hours on working days.</p>
            </div>

            <div className="cu-info-items">
              <a href="tel:+917499631188" className="cu-info-item glass-panel">
                <div className="cu-info-icon">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <strong>Phone</strong>
                  <p>(+91) 7499631188</p>
                </div>
              </a>
              <a href="mailto:arctic.arena2024@gmail.com" className="cu-info-item glass-panel">
                <div className="cu-info-icon">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <strong>Email</strong>
                  <p>arctic.arena2024@gmail.com</p>
                </div>
              </a>
              <div className="cu-info-item glass-panel">
                <div className="cu-info-icon">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <strong>Location</strong>
                  <p>PCCOE, Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>

            {/* Decorative availability badge */}
            <div className="cu-availability glass-panel">
              <span className="cu-dot" />
              <span>Team is currently <strong>available</strong> for new collaborations</span>
            </div>
          </div>

          {/* Right — form */}
          <div className="cu-form-side glass-panel">
            <div className="cu-form-header">
              <h3>Send a Message</h3>
              <p>Fill in the form and we'll get back to you shortly.</p>
            </div>

            <form onSubmit={handleSubmit} className="cu-form">
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="cu-input-wrapper">
                  <span className="material-symbols-outlined cu-input-icon">person</span>
                  <input
                    type="text" name="name" className="input-field cu-input"
                    placeholder="Your full name"
                    value={formData.name} onChange={handleChange} required
                  />
                </div>
              </div>

              <div className="cu-row">
                <div className="input-group">
                  <label className="input-label">Phone</label>
                  <div className="cu-input-wrapper">
                    <span className="material-symbols-outlined cu-input-icon">call</span>
                    <input
                      type="text" name="phoneNumber" className="input-field cu-input"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phoneNumber} onChange={handleChange} required
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <div className="cu-input-wrapper">
                    <span className="material-symbols-outlined cu-input-icon">mail</span>
                    <input
                      type="email" name="email" className="input-field cu-input"
                      placeholder="you@example.com"
                      value={formData.email} onChange={handleChange} required
                    />
                  </div>
                </div>
              </div>

              {/* Purpose chips */}
              <div className="input-group">
                <label className="input-label">Purpose of Contact</label>
                <div className="cu-chips">
                  {PURPOSE_OPTIONS.map(opt => (
                    <label
                      key={opt.value}
                      className={`cu-chip ${formData.weatherdata === opt.value ? 'cu-chip--active' : ''}`}
                    >
                      <input
                        type="radio" name="weatherdata" value={opt.value}
                        checked={formData.weatherdata === opt.value}
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      <span className="material-symbols-outlined">{opt.icon}</span>
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Message</label>
                <textarea
                  name="message" className="input-field cu-textarea"
                  placeholder="Tell us what you need…"
                  rows="4" value={formData.message}
                  onChange={handleChange} required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block cu-submit"
                disabled={status === 'sending'}
              >
                {status === 'sending'
                  ? <><span className="cu-spinner" /> Sending…</>
                  : <><span className="material-symbols-outlined">send</span> Send Message</>
                }
              </button>

              {status === 'success' && (
                <div className="cu-status cu-status--success">
                  <span className="material-symbols-outlined">check_circle</span>
                  Message sent successfully! We'll be in touch soon.
                </div>
              )}
              {status === 'error' && (
                <div className="cu-status cu-status--error">
                  <span className="material-symbols-outlined">error</span>
                  Something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
