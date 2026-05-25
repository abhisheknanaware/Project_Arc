import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';



// --- Sliding Info Panel Data ---
const INFO_SLIDES = [
  {
    icon: 'air',
    title: 'Real-Time AQI Tracking',
    desc: 'Monitor live Air Quality Index values across all major urban zones with sub-minute refresh rates.',
  },
  {
    icon: 'monitoring',
    title: 'Predictive Analytics',
    desc: 'Our ML models forecast pollution spikes up to 48 hours in advance, giving you time to act.',
  },
  {
    icon: 'medical_information',
    title: 'Personalized Health Alerts',
    desc: "Receive tailored notifications based on your health profile and your area's current conditions.",
  },
  {
    icon: 'directions_car',
    title: 'Traffic-Pollution Correlation',
    desc: 'Understand how peak-hour congestion elevates PM2.5 and NOx levels in your neighborhood.',
  },
  {
    icon: 'public',
    title: 'Open Environmental Data',
    desc: 'Access our API for academic research, NGO reporting, and municipal planning initiatives.',
  },
];

// --- FAQ Data ---
const FAQS = [
  {
    q: 'What is Project ARC?',
    a: 'Project ARC (Air-quality Real-time Computing) is an intelligent environmental platform that aggregates live sensor data, satellite feeds, and traffic telemetry to give citizens, researchers, and city planners an accurate picture of urban air quality.',
  },
  {
    q: 'How accurate is the AQI data?',
    a: 'Our data pipeline combines government monitoring stations, IoT sensor networks, and satellite observations, cross-validated to achieve a confidence level above 98%. Readings are refreshed every 60 seconds.',
  },
  {
    q: 'Is Project ARC free to use?',
    a: 'Yes! The core AQI explorer, health alerts, and historical data are completely free for individual users. Advanced API access and enterprise dashboards are available under our Pro plan.',
  },
  {
    q: 'Which cities and regions are covered?',
    a: 'We currently cover 50+ urban zones across India, with active expansion in South-East Asia. Coverage maps are updated every quarter as new sensor networks come online.',
  },
  {
    q: 'How do I get personalised health alerts?',
    a: 'Create a free account, complete your health profile (age, any respiratory conditions, activity level), and choose your preferred zones. We will send alerts via email or in-app notifications whenever conditions change significantly.',
  },
  {
    q: 'Can I use Project ARC data in my research?',
    a: 'Absolutely. Register for an API key through your dashboard. Academic and non-profit researchers receive expanded rate limits at no cost. Please cite Project ARC in any published work.',
  },
];

// ---- Animated counter ----
const useCounter = (target, duration = 1800) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = target / (duration / 16);
          const tick = () => {
            start += step;
            if (start < target) {
              setCount(Math.floor(start));
              ref.current._raf = requestAnimationFrame(tick);
            } else {
              setCount(target);
            }
          };
          ref.current._raf = requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current?._raf) cancelAnimationFrame(ref.current._raf);
      observer.disconnect();
    };
  }, [target, duration]);

  return [count, ref];
};

const StatItem = ({ value, suffix, label }) => {
  const numVal = parseInt(value);
  const [count, ref] = useCounter(numVal);
  return (
    <div className="stat-item" ref={ref}>
      <h3 className="stat-number">
        {count}{suffix}
      </h3>
      <p>{label}</p>
    </div>
  );
};

// ---- Sliding Info Panel ----
const SlidingInfoPanel = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % INFO_SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="sliding-panel-section">
      <div className="sliding-panel-header">
        <span className="badge-premium">Platform Highlights</span>
        <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
          Everything You Need to <span className="highlight">Breathe Easy</span>
        </h2>
        <p className="sliding-panel-sub">
          Swipe through our core capabilities below
        </p>
      </div>

      <div className="sliding-panel-track">
        {/* Tabs */}
        <div className="panel-tabs">
          {INFO_SLIDES.map((slide, i) => (
            <button
              key={i}
              className={`panel-tab ${active === i ? 'active' : ''}`}
              onClick={() => setActive(i)}
            >
              <span className="material-symbols-outlined">{slide.icon}</span>
              <span className="panel-tab-label">{slide.title}</span>
            </button>
          ))}
        </div>

        {/* Slide Content */}
        <div className="panel-content-area">
          {INFO_SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`panel-slide glass-panel ${active === i ? 'panel-slide--active' : ''}`}
            >
              <div className="panel-slide-icon">
                <span className="material-symbols-outlined">{slide.icon}</span>
              </div>
              <h3>{slide.title}</h3>
              <p>{slide.desc}</p>
            </div>
          ))}

          {/* Progress dots */}
          <div className="panel-dots">
            {INFO_SLIDES.map((_, i) => (
              <button
                key={i}
                className={`panel-dot ${active === i ? 'active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ---- FAQ Accordion ----
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="faq-section">
      <div className="faq-inner">
        <span className="badge-premium">Got Questions?</span>
        <h2 className="section-title">
          Frequently Asked <span className="highlight">Questions</span>
        </h2>
        <p className="faq-sub">
          Everything you need to know about Project ARC. Can't find your answer?{' '}
          <Link to="/contactus" className="faq-link">Reach out to us.</Link>
        </p>

        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${openIndex === i ? 'faq-item--open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span>{faq.q}</span>
                <span className="faq-chevron material-symbols-outlined">
                  {openIndex === i ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
              </button>
              <div className="faq-answer-wrapper">
                <p className="faq-answer">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---- About Section ----
const AboutProduct = () => (
  <section className="about-section">
    <div className="about-inner">
      <div className="about-text">
        <span className="badge-premium">What We Do</span>
        <h2>
          What is <span className="highlight">Project ARC?</span>
        </h2>
        <p>
          <strong>Project ARC</strong> — short for <em>Air-quality Real-time Computing</em> — is
          a comprehensive environmental intelligence platform built to make air quality data
          accessible, understandable, and actionable for everyone.
        </p>
        <p>
          We fuse government sensor networks, IoT devices, satellite imagery, and traffic feeds
          into a single, beautifully visualised dashboard. Whether you're a concerned citizen
          checking today's AQI before your morning run, a researcher studying urban pollution
          patterns, or a city planner designing greener transit routes — Project ARC has the
          data and tools you need.
        </p>
        <div className="about-pills">
          {['Live AQI Maps', 'ML Forecasting', 'Health Advisories', 'Open API', 'Traffic Insights', 'Green Zones'].map(tag => (
            <span key={tag} className="about-pill">{tag}</span>
          ))}
        </div>
      </div>
      <div className="about-visual">
        <div className="about-glow-ring">
          <span className="material-symbols-outlined about-big-icon">language</span>
        </div>
        <div className="about-floating-badge ab1 glass-panel">
          <span className="material-symbols-outlined">sensors</span> 50+ Zones
        </div>
        <div className="about-floating-badge ab2 glass-panel">
          <span className="material-symbols-outlined">bolt</span> Real-Time
        </div>
        <div className="about-floating-badge ab3 glass-panel">
          <span className="material-symbols-outlined">shield</span> 98% Accuracy
        </div>
      </div>
    </div>
  </section>
);

// --- Simulated AQI Nodes for Interactive Widget ---
const SIMULATED_NODES = [
  { id: 'n1', name: 'Node Delhi-East', location: 'Mayur Vihar', baseAqi: 154, type: 'Urban Industrial', pm25: 98, pm10: 165, temp: 31, humidity: 42 },
  { id: 'n2', name: 'Node Delhi-Central', location: 'Connaught Place', baseAqi: 112, type: 'Commercial Peak', pm25: 64, pm10: 120, temp: 32, humidity: 38 },
  { id: 'n3', name: 'Node Mumbai-Port', location: 'Colaba Waterfront', baseAqi: 58, type: 'Coastal Marine', pm25: 35, pm10: 62, temp: 29, humidity: 75 },
  { id: 'n4', name: 'Node Bangalore-Tech', location: 'Electronic City Phase II', baseAqi: 42, type: 'Suburban Canopy', pm25: 18, pm10: 45, temp: 24, humidity: 55 },
  { id: 'n5', name: 'Node Chennai-Shore', location: 'Marina Beach Road', baseAqi: 48, type: 'Coastal Highway', pm25: 22, pm10: 50, temp: 30, humidity: 70 },
  { id: 'n6', name: 'Node Kolkata-North', location: 'Salt Lake Sector V', baseAqi: 135, type: 'High Density Transit', pm25: 82, pm10: 148, temp: 33, humidity: 62 }
];

const InteractiveSensorWidget = () => {
  const [nodes, setNodes] = useState(SIMULATED_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState('n1');
  const [filter, setFilter] = useState('all');
  const [history, setHistory] = useState({
    n1: [150, 153, 155, 152, 154, 156, 153, 155, 154],
    n2: [110, 114, 112, 109, 111, 113, 110, 112, 112],
    n3: [55, 57, 59, 58, 56, 58, 57, 59, 58],
    n4: [40, 42, 43, 41, 40, 42, 41, 43, 42],
    n5: [45, 47, 48, 46, 47, 49, 46, 48, 48],
    n6: [130, 134, 137, 132, 135, 138, 133, 136, 135]
  });

  // Smooth real-time fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => {
          const change = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
          const newAqi = Math.max(15, Math.min(480, node.baseAqi + change));
          const pm25Val = Math.round(newAqi * 0.63);
          const pm10Val = Math.round(newAqi * 1.08);

          return {
            ...node,
            baseAqi: newAqi,
            pm25: pm25Val,
            pm10: pm10Val
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Update sparkline history
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => {
        const next = { ...prev };
        nodes.forEach(node => {
          const currentHist = next[node.id] || [node.baseAqi];
          const updatedHist = [...currentHist.slice(1), node.baseAqi];
          next[node.id] = updatedHist;
        });
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [nodes]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const selectedHistory = history[selectedNode.id] || [selectedNode.baseAqi];

  const getAqiDetails = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: '#3fb950', bg: 'rgba(63, 185, 80, 0.12)', advice: 'Extremely safe for outdoor sports and activities.' };
    if (aqi <= 100) return { label: 'Moderate', color: '#ff9500', bg: 'rgba(255, 149, 0, 0.12)', advice: 'Acceptable quality. Sensitive groups should monitor heavy exertion.' };
    if (aqi <= 150) return { label: 'Unhealthy (Sensitve)', color: '#ff7b72', bg: 'rgba(255, 123, 114, 0.12)', advice: 'Sensitive individuals might feel health effects. Limit exposure.' };
    return { label: 'Hazardous / Unhealthy', color: '#f85149', bg: 'rgba(248, 81, 73, 0.12)', advice: 'Wear masks. Avoid heavy exertion. Keep indoor purifiers active.' };
  };

  const aqiInfo = getAqiDetails(selectedNode.baseAqi);

  const filteredNodes = nodes.filter(node => {
    if (filter === 'all') return true;
    if (filter === 'good') return node.baseAqi <= 50;
    if (filter === 'moderate') return node.baseAqi > 50 && node.baseAqi <= 100;
    if (filter === 'unhealthy') return node.baseAqi > 100;
    return true;
  });

  // Calculate sparkline points for SVG (width 220, height 50)
  const sparklinePoints = selectedHistory.map((val, index) => {
    const x = (index / (selectedHistory.length - 1)) * 220;
    const maxVal = Math.max(...selectedHistory) + 5;
    const minVal = Math.max(0, Math.min(...selectedHistory) - 5);
    const range = maxVal - minVal || 1;
    const y = 45 - ((val - minVal) / range) * 35;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="sensor-widget-container glass-panel animate-fade-in">
      <div className="widget-header">
        <div className="widget-title-area">
          <span className="live-badge"><span className="pulse-dot"></span> LIVE SENSOR STREAM</span>
          <h4>Intelligent Node Grid</h4>
        </div>
        <div className="filter-buttons">
          {['all', 'good', 'moderate', 'unhealthy'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="widget-body">
        <div className="node-list-column">
          {filteredNodes.length > 0 ? (
            filteredNodes.map(node => {
              const info = getAqiDetails(node.baseAqi);
              return (
                <div
                  key={node.id}
                  className={`node-item ${selectedNodeId === node.id ? 'active' : ''}`}
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  <div className="node-item-info">
                    <span className="node-item-name">{node.name}</span>
                    <span className="node-item-loc">{node.location}</span>
                  </div>
                  <span className="node-item-aqi-badge" style={{ color: info.color, background: info.bg }}>
                    {node.baseAqi}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="no-nodes-placeholder">
              <span className="material-symbols-outlined">sensors_off</span>
              <p>No active nodes match filter</p>
            </div>
          )}
        </div>

        <div className="node-details-column">
          <div className="details-header">
            <div>
              <h3>{selectedNode.name}</h3>
              <span className="badge-type">{selectedNode.type}</span>
            </div>
            <div className="details-aqi-circle" style={{ borderColor: aqiInfo.color, boxShadow: `0 0 20px ${aqiInfo.color}1e` }}>
              <span className="daq-val" style={{ color: aqiInfo.color }}>{selectedNode.baseAqi}</span>
              <span className="daq-lbl">AQI</span>
            </div>
          </div>

          <div className="health-rating-bar" style={{ background: aqiInfo.bg, borderLeft: `4px solid ${aqiInfo.color}` }}>
            <strong>Condition: {aqiInfo.label}</strong>
            <p style={{ margin: 0, fontSize: '0.8rem' }}>{aqiInfo.advice}</p>
          </div>

          <div className="telemetry-grid">
            <div className="tele-item">
              <span className="t-lbl">PM2.5</span>
              <span className="t-val">{selectedNode.pm25} <span className="t-unit">µg/m³</span></span>
            </div>
            <div className="tele-item">
              <span className="t-lbl">PM10</span>
              <span className="t-val">{selectedNode.pm10} <span className="t-unit">µg/m³</span></span>
            </div>
            <div className="tele-item">
              <span className="t-lbl">Temp</span>
              <span className="t-val">{selectedNode.temp}°C</span>
            </div>
            <div className="tele-item">
              <span className="t-lbl">Humidity</span>
              <span className="t-val">{selectedNode.humidity}%</span>
            </div>
          </div>

          <div className="widget-sparkline-area">
            <div className="sparkline-title">
              <span>REAL-TIME STREAM TREND</span>
              <span className="t-stream-active">Active</span>
            </div>
            <div className="sparkline-graph">
              <svg viewBox="0 0 220 50" className="sparkline-svg">
                <path
                  d={`M 0,50 L ${sparklinePoints} L 220,50 Z`}
                  fill={`url(#sparklineGrad-${selectedNode.id})`}
                  opacity="0.15"
                />
                <polyline
                  fill="none"
                  stroke={aqiInfo.color}
                  strokeWidth="2"
                  points={sparklinePoints}
                />
                <defs>
                  <linearGradient id={`sparklineGrad-${selectedNode.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={aqiInfo.color} />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- Main Component ----
const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
      
      hero.style.setProperty('--mx', x.toFixed(3));
      hero.style.setProperty('--my', y.toFixed(3));
    };

    const handleMouseLeave = () => {
      hero.style.setProperty('--mx', '0');
      hero.style.setProperty('--my', '0');
    };

    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="home-landing">
      {/* Hero Section — CSS Only */}
      <header className="hero-section" ref={heroRef}>
        {/* Animated background layers */}
        <div className="hero-bg-grid" />
        <div className="hero-orb hero-orb--1" />
        <div className="hero-orb hero-orb--2" />
        <div className="hero-orb hero-orb--3" />

        {/* Floating dashboard cards */}
        <div className="hero-card hero-card--aqi glass-panel">
          <div className="hcard-label">AQI Index · Delhi NCR</div>
          <div className="hcard-value" style={{ color: '#f85149' }}>168</div>
          <div className="hcard-sub">Unhealthy · PM2.5: 112 µg/m³</div>
          <div className="hcard-bar">
            <div className="hcard-bar-fill" style={{ width: '68%', background: 'linear-gradient(90deg,#f85149,#ff9500)' }} />
          </div>
        </div>

        <div className="hero-card hero-card--green glass-panel">
          <div className="hcard-label">Green Zone · Lodhi Garden</div>
          <div className="hcard-value" style={{ color: '#3fb950' }}>42</div>
          <div className="hcard-sub">Good · Safe for outdoor activity</div>
          <div className="hcard-bar">
            <div className="hcard-bar-fill" style={{ width: '28%', background: 'linear-gradient(90deg,#3fb950,#58a6ff)' }} />
          </div>
        </div>

        <div className="hero-card hero-card--stat glass-panel">
          <div className="hcard-label">Live Sensors</div>
          <div className="hcard-value" style={{ color: '#58a6ff' }}>3,241</div>
          <div className="hcard-sub">↑ 98.2% uptime · Refreshed 12s ago</div>
        </div>

        {/* Main content */}
        <div className="hero-content animate-slide-up">
          <span className="badge-premium">Intelligent Air Quality Platform</span>
          <h1>Breathing Better with <span className="highlight">Project ARC</span></h1>
          <p>
            The comprehensive ecosystem for real-time air quality monitoring, predictive
            analytics, and data-driven health insights designed for the modern urban environment.
          </p>
          <div className="hero-buttons">
            <Link to="/aqi" className="btn btn-primary btn-lg">
              <span className="material-symbols-outlined">map</span> Explore AQI Map
            </Link>
            <Link to="/aboutus" className="btn btn-outline btn-lg">
              Learn More
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint">
          <span className="material-symbols-outlined scroll-arrow">keyboard_arrow_down</span>
        </div>
      </header>

      {/* Stats Banner */}
      <section className="stats-banner">
        <StatItem value="24" suffix="/7" label="Active Monitoring" />
        <StatItem value="98" suffix="%" label="Confidence Level" />
        <StatItem value="50" suffix="+" label="Coverage Zones" />
        <StatItem value="10000" suffix="+" label="Active Users" />
      </section>

      {/* About Product */}
      <AboutProduct />

      {/* Sliding Info Panel */}
      <SlidingInfoPanel />

      {/* Features Grid */}
      <section className="features-container">
        <span className="badge-premium" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem' }}>Why ARC?</span>
        <h2 className="section-title">Core <span className="highlight">Capabilities</span></h2>
        <div className="features-grid">
          {[
            { icon: 'query_stats', title: 'Advanced Analytics', desc: 'Utilising high-precision machine learning models to forecast air quality trends with exceptional accuracy.' },
            { icon: 'commute', title: 'Traffic Correlation', desc: 'Identifying key links between vehicular patterns and atmospheric conditions to optimise urban transit.' },
            { icon: 'health_and_safety', title: 'Health Intelligence', desc: 'Delivering actionable advice and proactive alerts to safeguard public health in high-pollution zones.' },
            { icon: 'cloud_sync', title: 'Live Data Feeds', desc: 'Pulling data from 3,000+ sensors nationwide and refreshing the dashboard every 60 seconds.' },
            { icon: 'notifications_active', title: 'Smart Alerts', desc: 'Push, email, and in-app notifications configured to your personal health profile and location.' },
            { icon: 'api', title: 'Open API', desc: 'RESTful endpoints available for researchers, governments, and developers — free for non-commercial use.' },
          ].map(f => (
            <div key={f.title} className="feature-card glass-panel">
              <div className="icon-wrapper">
                <span className="material-symbols-outlined">{f.icon}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="section-grid">
          <div className="text-content">
            <h2>Data Transparency <br /> for <span className="highlight">Urban Living</span></h2>
            <p>
              Project ARC bridges the gap between complex environmental data and everyday
              decision-making. Our integrated platform processes thousands of data points to
              ensure you have the clearest perspective on the air you breathe.
            </p>
            <ul className="feature-list">
              <li><span className="material-symbols-outlined">check_circle</span> Hyper-local pollutant tracking (PM2.5, PM10, CO)</li>
              <li><span className="material-symbols-outlined">check_circle</span> Real-time meteorological data integration</li>
              <li><span className="material-symbols-outlined">check_circle</span> Open API for environmental research</li>
              <li><span className="material-symbols-outlined">check_circle</span> Green zone identification and route guidance</li>
            </ul>
          </div>
          <div className="visual-content">
            <InteractiveSensorWidget />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-box animate-slide-up">
          <span className="cta-glow" />
          <h2>Empowering Future Cities</h2>
          <p>
            Take the first step towards a healthier lifestyle. Join the Project ARC community
            and start tracking your local air quality today.
          </p>
          <div className="hero-buttons" style={{ marginTop: '2.5rem' }}>
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started for Free</Link>
            <Link to="/contactus" className="btn btn-outline btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
