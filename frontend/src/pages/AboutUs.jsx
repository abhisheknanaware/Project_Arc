import React from 'react';
import './AboutUs.css';

const TEAM_VALUES = [
  { icon: 'science',         title: 'Data-Driven',   desc: 'Every decision is backed by real sensor data, satellite feeds, and validated research.' },
  { icon: 'public',          title: 'Impact-First',  desc: 'We build for the citizens and city planners who need clean, actionable environmental data.' },
  { icon: 'diversity_3',     title: 'Open Collab',   desc: 'Our codebase and datasets are open for academic and non-profit research worldwide.' },
  { icon: 'energy_savings_leaf', title: 'Eco-Focused', desc: 'Sustainability is our north star — from green zone mapping to low-power sensor design.' },
];

const TIMELINE = [
  { year: '2023', title: 'Idea & Research', desc: 'Identified the traffic–pollution correlation gap in Indian smart-city datasets. Began literature review and sensor feasibility studies.' },
  { year: 'Early 2024', title: 'Data Collection', desc: 'Deployed initial sensor nodes across Pune. Integrated CPCB APIs and traffic telemetry feeds for a unified data pipeline.' },
  { year: 'Mid 2024', title: 'ML Model & Dashboard', desc: 'Trained a gradient-boosting AQI forecast model (98%+ confidence). Launched the web dashboard for public beta testing.' },
  { year: 'Late 2024', title: 'Expansion & API', desc: 'Extended coverage to 50+ urban zones. Released the open API and onboarded 10,000+ active users.' },
  { year: '2025 →', title: 'Scale & Partnerships', desc: 'Partnering with municipal corporations and NGOs. Expanding to South-East Asia with real-time satellite enrichment.' },
];

const STATS = [
  { value: '50+',   label: 'Cities Covered' },
  { value: '3k+',   label: 'Sensors Online' },
  { value: '10k+',  label: 'Active Users' },
  { value: '98%',   label: 'Model Accuracy' },
];

const AboutUs = () => (
  <div className="au-page animate-fade-in">

    {/* ── Hero ── */}
    <section className="au-hero">
      <div className="au-hero-orb au-orb1" />
      <div className="au-hero-orb au-orb2" />
      <div className="au-hero-grid" />
      <div className="au-hero-content">
        <span className="badge-au">Our Mission</span>
        <h1>Building a <span className="au-hl">Cleaner, Smarter</span><br />Urban Future</h1>
        <p>
          Project ARC is a student-built environmental intelligence platform that turns raw
          air-quality and traffic data into insights anyone can act on — from morning joggers
          to city planners.
        </p>
      </div>
    </section>

    {/* ── Stats strip ── */}
    <div className="au-stats-strip">
      {STATS.map(s => (
        <div key={s.label} className="au-stat">
          <span className="au-stat-value">{s.value}</span>
          <span className="au-stat-label">{s.label}</span>
        </div>
      ))}
    </div>

    {/* ── Who We Are ── */}
    <section className="au-section">
      <div className="au-section-inner au-who">
        <div className="au-who-text">
          <span className="badge-au">Who We Are</span>
          <h2>A Team Passionate About <span className="au-hl">Clean Air</span></h2>
          <p>
            We are a multidisciplinary team of students from PCCOE, Pune, united by a single
            mission: make air quality data accessible, understandable, and actionable for every
            citizen.
          </p>
          <p>
            Our backgrounds span data science, embedded systems, full-stack engineering, and
            urban planning. That diversity lets us approach the problem from every angle —
            from low-power IoT sensor design to predictive ML pipelines and beautiful,
            consumer-grade dashboards.
          </p>
          <p>
            Through Project ARC we aim to promote environmental awareness, encourage smart
            mobility, and contribute to eco-friendly city planning — using technology not just
            to observe problems, but to create impactful solutions that improve everyday life.
          </p>
        </div>
        <div className="au-who-cards">
          {TEAM_VALUES.map(v => (
            <div key={v.title} className="au-value-card glass-panel">
              <span className="material-symbols-outlined au-card-icon">{v.icon}</span>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Journey / Timeline ── */}
    <section className="au-section au-section--dark">
      <div className="au-section-inner">
        <div className="au-section-head">
          <span className="badge-au">How We Got Here</span>
          <h2>The Journey of <span className="au-hl">Project ARC</span></h2>
          <p className="au-section-sub">From a classroom idea to a platform serving thousands of users.</p>
        </div>
        <div className="au-timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className={`au-tl-item ${i % 2 === 0 ? 'au-tl-left' : 'au-tl-right'}`}>
              <div className="au-tl-dot" />
              <div className="au-tl-card glass-panel">
                <span className="au-tl-year">{item.year}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
          <div className="au-tl-line" />
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="au-cta-section">
      <div className="au-cta-box">
        <div className="au-cta-glow" />
        <h2>Want to Collaborate?</h2>
        <p>We welcome researchers, NGOs, and city planners who want to use or contribute to Project ARC's open data ecosystem.</p>
        <a href="/contactus" className="btn btn-primary btn-lg" style={{ marginTop: '2rem', display: 'inline-flex' }}>
          <span className="material-symbols-outlined">handshake</span> Get in Touch
        </a>
      </div>
    </section>
  </div>
);

export default AboutUs;
